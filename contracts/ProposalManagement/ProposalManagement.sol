pragma solidity ^0.5.0;

interface TrustTokenInterface {
    function setManagement(address) external;
    function isTrustee(address) external view returns(bool);
    function trusteeCount() external view returns(uint256);
    function lockUser(address) external returns(bool);
    function unlockUsers(address[] calldata) external;
}

interface ProposalFactoryInterface {
    function newContractFeeProposal(uint256, uint16, uint8) external returns(address);
    function newMemberProposal(address, bool, uint256, uint8) external returns(address);
}

interface ContractFeeProposalInterface {
    function vote(bool, address) external returns(bool, bool);
    function proposedFee() external view returns(uint256);
    function kill() external;
}

interface MemberProposalInterface {
    function vote(bool, address) external returns(bool, bool);
    function memberAddress() external view returns(address);
    function kill() external;
}

contract ProposalManagement {
    /*
     * proposalType == 0 -> invalid proposal
     * proposalType == 1 -> contractFee proposal
     * proposalType == 2 -> addMember proposal
     * proposalType == 3 -> removeMember proposal
     */
    mapping(address => uint256) public proposalType;
    mapping(address => uint256) public memberId;
    mapping(address => address[]) private lockedUsersPerProposal;
    mapping(address => uint256) private userProposalLocks;
    mapping(address => address[]) private unlockUsers;
    mapping(address => uint256) private proposalIndex;

    address[] private proposals;
    address private trustTokenContract;
    address private proposalFactory;
    uint256 public contractFee;
    uint16 public minimumNumberOfVotes = 1;
    uint8 public majorityMargin = 50;
    address[] public members;

    event ProposalCreated();
    event ProposalExecuted();
    event NewContractFee();
    event MembershipChanged();

    constructor(address _proposalFactoryAddress, address _trustTokenContract) public {
        members.push(address(0));
        memberId[msg.sender] = members.length;
        members.push(msg.sender);
        contractFee = 1 ether;
        proposalFactory = _proposalFactoryAddress;
        trustTokenContract = _trustTokenContract;
        TrustTokenInterface(trustTokenContract).setManagement(address(this));
    }

    /**
     * @notice creates a proposal contract to change the fee used in LendingRequests
     * @param _proposedFee the new fee
     */
    function createContractFeeProposal(uint256 _proposedFee) external {
        // validate input
        require(memberId[msg.sender] != 0, "not a member");
        require(_proposedFee > 0, "invalid fee");

        address proposal = ProposalFactoryInterface(proposalFactory)
            .newContractFeeProposal(_proposedFee, minimumNumberOfVotes, majorityMargin);

        // add created proposal to management structure and set correct proposal type
        proposalIndex[proposal] = proposals.length;
        proposals.push(proposal);
        proposalType[proposal] = 1;

        emit ProposalCreated();
    }

    /**
     * @notice creates a proposal contract to change membership status for the member
     * @param _memberAddress the address of the member
     * @param _adding true if member is to be added false otherwise
     * @dev only callable by registered members
     */
    function createMemberProposal(address _memberAddress, bool _adding) external {
        // validate input
        require(TrustTokenInterface(trustTokenContract).isTrustee(msg.sender), "invalid caller");
        require(_memberAddress != address(0), "invalid memberAddress");
        if(_adding) {
            require(memberId[_memberAddress] == 0, "cannot add twice");
        } else {
            require(memberId[_memberAddress] != 0, "no member");
        }

        uint256 trusteeCount = TrustTokenInterface(trustTokenContract).trusteeCount();
        address proposal = ProposalFactoryInterface(proposalFactory).newMemberProposal(_memberAddress, _adding, trusteeCount, majorityMargin);

        // add created proposal to management structure and set correct proposal type
        proposalIndex[proposal] = proposals.length;
        proposals.push(proposal);
        proposalType[proposal] = _adding ? 2 : 3;

        emit ProposalCreated();
    }

    /**
     * @notice vote for a proposal at the specified address
     * @param _stance true if you want to cast a positive vote, false otherwise
     * @param _proposalAddress the address of the proposal you want to vote for
     * @dev only callable by registered members
     */
    function vote(bool _stance, address _proposalAddress) external {
        // validate input
        uint256 proposalParameter = proposalType[_proposalAddress];
        require(proposalParameter != 0, "Invalid address");

        bool proposalPassed;
        bool proposalExecuted;

        if (proposalParameter == 1) {
            require(memberId[msg.sender] != 0, "not a member");

            (proposalPassed, proposalExecuted) = ContractFeeProposalInterface(_proposalAddress).vote(_stance, msg.sender);
        } else if (proposalParameter == 2 || proposalParameter == 3) {
            require(TrustTokenInterface(trustTokenContract).isTrustee(msg.sender), "invalid caller");
            require(TrustTokenInterface(trustTokenContract).lockUser(msg.sender), "userlock failed");

            (proposalPassed, proposalExecuted) = MemberProposalInterface(_proposalAddress).vote(_stance, msg.sender);
            lockedUsersPerProposal[_proposalAddress].push(msg.sender);

            // update number of locks for voting user
            userProposalLocks[msg.sender]++;
        }

        emit ProposalExecuted();

        // handle return values of voting call
        if (proposalExecuted) {
            require(
                handleVoteReturn(proposalParameter, proposalPassed, _proposalAddress),
                "voteReturn failed"
            );
        }
    }

    /**
     * @notice returns number of proposals
     * @return proposals.length
     */
    function getProposalsLength() external view returns (uint256) {
        return proposals.length;
    }

    /**
     * @notice returns all saved proposals
     * @return proposals or [] if empty
     */
    function getProposals() external view returns (address[] memory props) {
        return proposals.length != 0 ? proposals : props;
    }

    /**
     * @notice returns the number of current members
     * @return number of members
     */
    function getMembersLength() external view returns (uint256) {
        return members.length;
    }

    /**
     * @notice returns the proposal parameters
     * @param _proposal the address of the proposal to get the parameters for
     * @return proposalAddress the address of the queried proposal
     * @return propType the type of the proposal
     * @return proposalFee proposed contractFee if type is fee proposal
     * @return memberAddress address of the member if type is member proposal
     */
    function getProposalParameters(address _proposal)
        external
        view
        returns (address proposalAddress, uint256 propType, uint256 proposalFee, address memberAddress) {
        // verify input parameters
        propType = proposalType[_proposal];
        require(propType != 0, "invalid input");

        proposalAddress = _proposal;
        if (propType == 1) {
            proposalFee = ContractFeeProposalInterface(_proposal).proposedFee();
        } else if (propType == 2 || propType == 3) {
            memberAddress = MemberProposalInterface(_proposal).memberAddress();
        }
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
        if (_parameter == 1) {
            if(_passed) {
                uint256 newContractFee = ContractFeeProposalInterface(_proposalAddress).proposedFee();
                // update contract fee
                contractFee = newContractFee;
                emit NewContractFee();
            }
            // remove proposal from management contract
            removeProposal(_proposalAddress);
            return true;

        /// case: memberProposal
        } else if (_parameter == 2 || _parameter == 3) {
            if(_passed) {
                address memberAddress = MemberProposalInterface(_proposalAddress).memberAddress();
                // add | remove member
                _parameter == 2 ? addMember(memberAddress) : removeMember(memberAddress);
            }
            // get locked users for proposal
            address[] memory lockedUsers = lockedUsersPerProposal[_proposalAddress];
            for(uint256 i; i < lockedUsers.length; i++) {
                // if user is locked for 1 proposal remember user for unlocking
                if (userProposalLocks[lockedUsers[i]] == 1) {
                    unlockUsers[_proposalAddress].push(lockedUsers[i]);
                }
                // decrease locked count for all users locked for the current proposal
                userProposalLocks[lockedUsers[i]]--;
            }
            TrustTokenInterface(trustTokenContract).unlockUsers(unlockUsers[_proposalAddress]);
            // remove proposal from mangement contract
            removeProposal(_proposalAddress);
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

        emit MembershipChanged();
    }

    /**
     * @dev removes the member at the specified address from current members
     * @param _memberAddress the address of the member to remove
     */
    function removeMember(address _memberAddress) private {
        // validate input
        uint256 mId = memberId[_memberAddress];
        require(mId != 0, "no member");

        // move member to the end of members array
        memberId[members[members.length - 1]] = mId;
        members[mId] = members[members.length - 1];
        // removes last element of storage array
        members.pop();
        // mark memberId as invalid
        memberId[_memberAddress] = 0;

        // if necessary: update voting parameters
        if (((members.length / 2) - 1) <= minimumNumberOfVotes) {
            minimumNumberOfVotes--;
        }

        emit MembershipChanged();
    }

    /**
     * @notice removes the proposal from the management structures
     * @param _proposal address of the proposal to remove
     */
    function removeProposal(address _proposal) private {
        // validate input
        uint256 propType = proposalType[_proposal];
        require(propType != 0, "invalid request");
        if (propType == 1) {
            ContractFeeProposalInterface(_proposal).kill();
        } else if (propType == 2 || propType == 3) {
            MemberProposalInterface(_proposal).kill();
        }

        // remove _proposal from the management contract
        uint256 idx = proposalIndex[_proposal];
        if (proposals[idx] == _proposal) {
            proposalIndex[proposals[proposals.length - 1]] = idx;
            proposals[idx] = proposals[proposals.length - 1];
            proposals.pop();
        }

        // mark _proposal as invalid proposal
        proposalType[_proposal] = 0;
    }
}
