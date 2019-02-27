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
    event ProposalExecuted(address ContractFeeProposal);
    event NewContractFee(uint256 oldFee, uint256 newFee);
    event MembershipChanged(address memberAddress, bool memberStatus);
    event CurrentLockedUsers(address[] unlockUsers);

    /// constructor
    constructor(address _proposalFactoryAddress) public {
        members.push(address(0));
        memberId[msg.sender] = members.length;
        members.push(msg.sender);
        contractFee = 1000 finney;
        proposalFactory = _proposalFactoryAddress;
    }

    /// fallback
    /// external
    /// public
    
    /**
     * @notice creates a proposal contract to change the fee used in LendingRequests
     * @param _proposedFee the new fee that is being suggested
     * @dev only callable by registered members
     */

    function createContractFeeProposal(uint256 _proposedFee) public onlyMembers {
        require(_proposedFee >= 1, "Minimum Fee is 0.1 Ether");
        uint256 feeInFinney = _proposedFee * 100 finney;

        bytes memory payload = abi.encodeWithSignature(
            "newProposal(uint256,uint256,uint256)",
            feeInFinney, minimumNumberOfVotes, majorityMargin
        );
        (bool success, bytes memory encodedReturnValue) = proposalFactory.call(payload);
        require(success, "contractfee proposal failed");
        address proposal = abi.decode(encodedReturnValue, (address));
        emit ProposalCreated(proposal, "contractFeeProposal");

        proposals[address(this)].push(proposal);
        proposalType[proposal] = 1;
    }

    /**
     * @notice creates a proposal contract to change membership status for the member
     * @param _memberAddress the address of the member
     * @param _adding true if member is to be added false otherwise 
     * @dev only callable by registered members
     */

    function createMemberProposal(address _memberAddress, bool _adding) public onlyMembers {
        require(_memberAddress != address(0), "invalid memberAddress");

        if(_adding) {
            require(memberId[_memberAddress] == 0, "cannot add member twice");
        } else {
            require(memberId[_memberAddress] != 0, "member does not exist");
        }

        bytes memory payload = abi.encodeWithSignature(
            "newProposal(address,bool,uint256,uint256)",
            _memberAddress, _adding, minimumNumberOfVotes, majorityMargin
        );
        (bool success, bytes memory encodedReturnValue) = proposalFactory.call(payload);
        require(success, "member proposal failed");
        address proposal = abi.decode(encodedReturnValue, (address));
        emit ProposalCreated(proposal, "memberProposal");

        proposals[address(this)].push(proposal);
        proposalType[proposal] = _adding ? 2 : 3;
    }

    /**
     * @notice vote for a proposal at the specified address
     * @param _stance true if you want to cast a positive vote, false otherwise
     * @param _proposalAddress the address of the proposal you want to vote for
     * @dev only callable by registered members
     */

    function vote(bool _stance, address _proposalAddress) public onlyMembers {
        uint256 proposalParameter = proposalType[_proposalAddress];
        require(proposalParameter != 0, "Invalid proposalAddress");

        // vote for proposal at _proposalAddress
        emit Voted(_proposalAddress, _stance, msg.sender);
        bytes memory payload = abi.encodeWithSignature("vote(bool,address)", _stance, msg.sender);
        (bool success, bytes memory encodedReturnValue) = _proposalAddress.call(payload);
        
        // check if voting was successfull
        require(success, "voting failed");
        lockedUsersPerProposal[_proposalAddress].push(msg.sender);

        // decode return values of successful function call
        bool proposalPassed = abi.decode(encodedReturnValue, (bool));
        emit ProposalExecuted(_proposalAddress);

        // handle return values of voting call
        require(
            handleVoteReturn(proposalParameter, proposalPassed, _proposalAddress),
            "processing of vote return failed"
        );
        
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

    /// internal

    /// private

    /**
     * @dev handles the return value of the vote function
     * @param _parameter internal representation of proposal type
     * @param _passed true if proposal passed false otherwise
     * @param _proposalAddress address of the proposal currently being executed
     */

    function handleVoteReturn(uint256 _parameter, bool _passed, address _proposalAddress)
        private
        returns (bool) {
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
            // remove proposal from openProposals
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

                _parameter == 2 ? addMember(memberAddress) : removeMember(memberAddress);
            }
            return true;
        }
        return false;
    }

    /**
     * @dev adds the member at the specified address to current members
     * @param _memberAddress the address of the member to add
     */

    function addMember(address _memberAddress) private {
        require(_memberAddress != address(0), "invalid address");
        require(memberId[_memberAddress] == 0, "already a member");

        memberId[_memberAddress] = members.length;
        members.push(_memberAddress);
        emit MembershipChanged(_memberAddress, true);

        if ((members.length / 2) > minimumNumberOfVotes) {
            minimumNumberOfVotes++;
        }
    }

    /**
     * @dev removes the member at the specified address from current members
     * @param _memberAddress the address of the member to remove
     */

    function removeMember(address _memberAddress) private {
        uint256 mId = memberId[_memberAddress];
        require(mId != 0, "the member you want to remove does not exist");

        for(uint256 i = mId; i < getMembersLength() - 1; i++) {
            memberId[members[i + 1]]--;
            members[i] = members[i + 1];
        }
        delete members[members.length - 1];
        members.length--;
        memberId[_memberAddress] = 0;
        emit MembershipChanged(_memberAddress, false);
        if ((members.length / 2) < minimumNumberOfVotes) {
            minimumNumberOfVotes--;
        }
    }

    /**
     * @dev changes the current fee to the new fee
     * @param _val the new fee
     */

    function setFee(uint256 _val) private {
        contractFee = _val;
    }
}
