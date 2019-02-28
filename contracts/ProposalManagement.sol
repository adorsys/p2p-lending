pragma solidity ^0.5.0;

contract ProposalManagement {
    /*
     * proposalType == 0 -> invalid proposal
     * proposalType == 1 -> contractFee proposal
     * proposalType == 2 -> addMember proposal
     * proposalType == 3 -> removeMember proposal
     * proposalType == 4 -> allowance proposal
     */
    mapping(address => uint256) public proposalType;
    mapping(address => address[]) private proposals;
    mapping(address => uint256) private memberId;
    mapping(address => address[]) private lockedUsersPerProposal;

    address private trustTokenContract;
    address private proposalFactory;
    uint256 public contractFee;
    uint256 public minimumNumberOfVotes = 1;
    uint256 public majorityMargin = 50;
    address[] public members;

    modifier onlyMembers() {
        require(memberId[msg.sender] != 0, "you need to be a member");
        _;
    }

    event ProposalCreated(address proposalAddress, string proposalType);
    event Voted(address proposalAddress, bool stance, address from);
    event ProposalExecuted(address executedProposal);
    event NewContractFee(uint256 oldFee, uint256 newFee);
    event MembershipChanged(address memberAddress, bool memberStatus);
    event CurrentLockedUsers(address[] unlockUsers);

    constructor(address _proposalFactoryAddress) public {
        members.push(address(0));
        memberId[msg.sender] = members.length;
        members.push(msg.sender);
        contractFee = 1000 finney;
        proposalFactory = _proposalFactoryAddress;
    }

    /**
     * @notice creates a proposal contract to change the fee used in LendingRequests
     * @param _proposedFee the new fee in range [1 ... x] which corresponds to [0.1 ... x] ETH
     * @dev only callable by registered members
     */
    function createContractFeeProposal(uint256 _proposedFee) public onlyMembers {
        // validate input
        require(_proposedFee >= 1, "Minimum Fee is 0.1 Ether");

        // input is in range [1 ... x] which corresponds to [0.1 ... x] ETH
        uint256 feeInFinney = _proposedFee * 100 finney;

        // prepare payload for function call - no spaces between parameters
        bytes memory payload = abi.encodeWithSignature(
            "newProposal(uint256,uint256,uint256)",
            feeInFinney, minimumNumberOfVotes, majorityMargin
        );

        // execute function call
        (bool success, bytes memory encodedReturnValue) = proposalFactory.call(payload);

        // check if function call was successful
        require(success, "contractfee proposal failed");

        // decode return value to get the address of the created proposal
        address proposal = abi.decode(encodedReturnValue, (address));

        // add created proposal to management structure and set correct proposal type
        proposals[address(this)].push(proposal);
        proposalType[proposal] = 1;
        emit ProposalCreated(proposal, "contractFeeProposal");
    }

    /**
     * @notice creates a proposal contract to change membership status for the member
     * @param _memberAddress the address of the member
     * @param _adding true if member is to be added false otherwise
     * @dev only callable by registered members
     */
    function createMemberProposal(address _memberAddress, bool _adding) public onlyMembers {
        // validate input
        require(_memberAddress != address(0), "invalid memberAddress");
        if(_adding) {
            require(memberId[_memberAddress] == 0, "cannot add member twice");
        } else {
            require(memberId[_memberAddress] != 0, "member does not exist");
        }

        // prepare payload for function call - no spaces between parameters
        bytes memory payload = abi.encodeWithSignature(
            "newProposal(address,bool,uint256,uint256)",
            _memberAddress, _adding, minimumNumberOfVotes, majorityMargin
        );

        // execute function call
        (bool success, bytes memory encodedReturnValue) = proposalFactory.call(payload);

        // check if function call was successful
        require(success, "member proposal failed");

        // decode return value to get the address of the created proposal
        address proposal = abi.decode(encodedReturnValue, (address));

        // add created proposal to management structure and set correct proposal type
        proposals[address(this)].push(proposal);
        proposalType[proposal] = _adding ? 2 : 3;
        emit ProposalCreated(proposal, "memberProposal");
    }

    /**
     * @notice vote for a proposal at the specified address
     * @param _stance true if you want to cast a positive vote, false otherwise
     * @param _proposalAddress the address of the proposal you want to vote for
     * @dev only callable by registered members
     */
    function vote(bool _stance, address _proposalAddress) public onlyMembers {
        // validate input
        uint256 proposalParameter = proposalType[_proposalAddress];
        require(proposalParameter != 0, "Invalid proposalAddress");

        // vote for proposal at _proposalAddress
        bytes memory payload = abi.encodeWithSignature("vote(bool,address)", _stance, msg.sender);
        (bool success, bytes memory encodedReturnValue) = _proposalAddress.call(payload);

        // check if voting was successfull
        require(success, "voting failed");

        // lock voting user
        lockedUsersPerProposal[_proposalAddress].push(msg.sender);
        emit Voted(_proposalAddress, _stance, msg.sender);

        // decode return values to check if proposal passed
        (bool proposalPassed, bool proposalExecuted) = abi.decode(encodedReturnValue, (bool, bool));
        emit ProposalExecuted(_proposalAddress);

        // handle return values of voting call
        if (proposalExecuted) {
            require(
                handleVoteReturn(proposalParameter, proposalPassed, _proposalAddress),
                "processing of vote return failed"
            );
        }

        // unlock users in ICO contract
        // address[] memory lockedUsers = lockedUsersPerProposal[_proposalAddress];
        // emit CurrentLockedUsers(lockedUsers);
    }

    /**
     * @dev returns all saved proposals
     */
    function getProposals() public view returns (address[] memory) {
        return(proposals[address(this)]);
    }

    /**
     * @dev returns the number of current members
     */
    function getMembersLength() public view returns (uint256) {
        return members.length;
    }

    /**
     * @dev handles the return value of the vote function
     * @param _parameter internal representation of proposal type
     * @param _passed true if proposal passed false otherwise
     * @param _proposalAddress address of the proposal currently being executed
     */
    function handleVoteReturn(uint256 _parameter, bool _passed, address _proposalAddress)
        private returns (bool) {
        /// case: contractFeeProposal
        if(_parameter == 1) {
            if(_passed) {
                // get new contract fee from proposal
                bytes memory payload = abi.encodeWithSignature("getContractFee()");
                (bool success, bytes memory encodedReturnValue) = _proposalAddress.call(payload);

                // throw if function call failed
                require(success, "could not get new contract fee");

                // decode contract fee
                uint256 newContractFee = abi.decode(encodedReturnValue, (uint256));
                uint256 oldContractFee = contractFee;

                // update contract fee
                setFee(newContractFee);
                emit NewContractFee(oldContractFee, newContractFee);
            }
            // remove proposal from management contract
            removeRequest(_proposalAddress);
            return true;
        /// case: memberProposal
        } else if(_parameter == 2 || _parameter == 3) {
            if(_passed) {
                // get member address
                bytes memory payload = abi.encodeWithSignature("getMemberAddress()");
                (bool success, bytes memory encodedReturnValue) = _proposalAddress.call(payload);

                // throw if function call failed
                require(success, "could not get memberAddress");

                // decode member address
                address memberAddress = abi.decode(encodedReturnValue, (address));

                // add | remove member
                _parameter == 2 ? addMember(memberAddress) : removeMember(memberAddress);
            }
            removeRequest(_proposalAddress);
            // remove proposal from mangement contract
            return true;
        }
        return false;
    }

    /**
     * @dev adds the member at the specified address to current members
     * @param _memberAddress the address of the member to add
     */
    function addMember(address _memberAddress) private {
        // validate input
        require(_memberAddress != address(0), "invalid address");
        require(memberId[_memberAddress] == 0, "already a member");

        memberId[_memberAddress] = members.length;
        members.push(_memberAddress);

        // if necessary: update voting parameters
        if (((members.length / 2) - 1) >= minimumNumberOfVotes) {
            minimumNumberOfVotes++;
        }
        emit MembershipChanged(_memberAddress, true);
    }

    /**
     * @dev removes the member at the specified address from current members
     * @param _memberAddress the address of the member to remove
     */
    function removeMember(address _memberAddress) private {
        // validate input
        uint256 mId = memberId[_memberAddress];
        require(mId != 0, "the member you want to remove does not exist");

        // move member to the end of members array
        for(uint256 i = mId; i < members.length - 1; i++) {
            memberId[members[i + 1]]--;
            members[i] = members[i + 1];
        }
        // removes last element of storage array
        members.pop();
        // mark memberId as invalid
        memberId[_memberAddress] = 0;

        // if necessary: update voting parameters
        if (((members.length / 2) - 1) <= minimumNumberOfVotes) {
            minimumNumberOfVotes--;
        }
        emit MembershipChanged(_memberAddress, false);
    }

    /**
     * @dev changes the current fee to the new fee
     * @param _val the new fee
     */
    function setFee(uint256 _val) private {
        contractFee = _val;
    }

    /**
     * @notice removes the lendingRequest from the management structures
     * @param _request the lendingRequest that will be removed
     */
    function removeRequest(address _request) private {
        // validate input
        require(proposalType[_request] != 0, "invalid request");

        // remove _request from the management contract
        for(uint256 i = 0; i < proposals[address(this)].length; i++) {
            // get index of _request in proposals array
            address currentRequest = proposals[address(this)][i];
            if(currentRequest == _request) {
                // move _request to the end of the array
                for(uint256 j = i; j < proposals[address(this)].length - 1; j++) {
                    proposals[address(this)][j] = proposals[address(this)][j + 1];
                }
                // removes last element of storage array
                proposals[address(this)].pop();
                break;
            }
        }
        // mark _request as invalid proposal
        proposalType[_request] = 0;
    }
}
