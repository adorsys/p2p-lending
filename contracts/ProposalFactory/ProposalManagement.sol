pragma solidity ^0.5.0;

import "./ProposalFactory.sol";

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

    address trustTokenContract;
    ProposalFactory private proposalFactory;
    uint256 public contractFee;
    uint256 public minimumNumberOfVotes = 1;
    uint256 public majorityMargin = 50;
    address[] public lockedUsers;
    address[] public members;

    modifier onlyMembers() {
        require(memberId[msg.sender] != 0, "you need to be a member");
        _;
    }

    event Voted(address proposalAddress, bool stance, address from);
    event ProposalExecuted(address ContractFeeProposal);
    event NewContractFee(uint256 oldFee, uint256 newFee);
    event MembershipChanged(address memberAddress, bool memberStatus);
    event UnlockUsers(address[] unlockUsers);

    /// constructor
    constructor() public {
        members.push(address(0));
        memberId[msg.sender] = members.length;
        members.push(msg.sender);
        contractFee = 1 finney;
        proposalFactory = new ProposalFactory();
    }

    /// fallback
    /// external
    /// public

    function createMemberProposal(address _memberAddress, bool _adding) public onlyMembers {
        require(_memberAddress != address(0), "invalid memberAddress");

        if(_adding) {
            require(memberId[_memberAddress] == 0, "cannot add member twice");
        } else {
            require(memberId[_memberAddress] != 0, "member does not exist");
        }

        address proposal = proposalFactory.newProposal(
            _memberAddress,
            _adding,
            minimumNumberOfVotes,
            majorityMargin
        );

        proposals[address(this)].push(proposal);
        proposalType[proposal] = _adding ? 2 : 3;
    }

    function createContractFeeProposal(uint256 _proposedFee) public onlyMembers {
        address proposal = proposalFactory.newProposal(
            _proposedFee * 1 finney,
            minimumNumberOfVotes,
            majorityMargin
        );
        proposals[address(this)].push(proposal);
        proposalType[proposal] = 1;
    }

    function vote(bool _stance, address _proposalAddress) public onlyMembers {
        uint256 proposalParameter = proposalType[_proposalAddress];
        require(proposalParameter != 0, "Invalid proposalAddress");

        /// vote for proposal at _proposalAddress
        emit Voted(_proposalAddress, _stance, msg.sender);
        bytes memory payload = abi.encodeWithSignature("vote(bool,address)", _stance, msg.sender);
        (bool success, bytes memory encodedReturnValue) = _proposalAddress.call(payload);

        require(success, "voting failed");

        /// decode return values of successful function call
        bool proposalPassed = abi.decode(encodedReturnValue, (bool));
        emit ProposalExecuted(_proposalAddress);

        /// handle return values of voting call
        require(
            handleVoteReturn(proposalParameter, proposalPassed, _proposalAddress),
            "processing of vote return failed"
        );
        

        /// unlock users in ICO contract
    }

    function getProposals() public view returns (address[] memory) {
        return(proposals[address(this)]);
    }

    function getMembersLength() public view returns (uint256) {
        return members.length;
    }

    /// internal

    /// private

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

    function setFee(uint256 _val) private {
        contractFee = _val;
    }
}
