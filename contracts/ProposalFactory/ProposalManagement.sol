pragma solidity ^0.5.0;

import "./ProposalFactory.sol";

contract ProposalManagement {
    struct Member {
        address memberAddress;
        string memberName;
    }

    mapping(address => address[]) private proposals;
    mapping(address => uint256) private memberId;

    uint256 public contractFee;
    ProposalFactory private proposalFactory;
    Member[] public members;
    address[] public lockedUsers;

    modifier onlyMembers() {
        require(memberId[msg.sender] != 0, "you need to be a member");
        _;
    }

    event Voted(address proposalAddress, bool stance, address from);
    event CallReturn(bool success, bool returnValue, uint256 proposalParameter);
    event NewContractFee(uint256 oldFee, uint256 newFee);

    /// constructor
    constructor() public {
        members.push(Member({
            memberAddress: address(0),
            memberName: "dummy"
        }));
        memberId[msg.sender] = members.length;
        members.push(Member({
            memberAddress: msg.sender,
            memberName: "creator"
        }));
        contractFee = 1 finney;
        proposalFactory = new ProposalFactory();
    }

    /// fallback
    /// external
    /// public
    function getProposals() public view returns (address[] memory) {
        return(proposals[address(this)]);
    }

    function getMembersLength() public view returns (uint256) {
        return members.length;
    }


    function createContractFeeProposal(uint256 _proposedFee) public {
        address proposal = proposalFactory.newContractFeeProposal(_proposedFee * 1 finney);
        proposals[address(this)].push(proposal);
    }

    function vote(bool _stance, address _proposalAddress) public onlyMembers {
        emit Voted(_proposalAddress, _stance, msg.sender);

        /// vote for proposal at _proposalAddress
        bytes memory payload = abi.encodeWithSignature("vote(bool,address)", _stance, msg.sender);
        (bool success, bytes memory encodedReturnValue) = _proposalAddress.call(payload);
        /// throw if function call failed
        require(success, "voting failed");
        /// decode return values of successful function call
        (bool proposalPassed, uint256 proposalParameter) = abi.decode(encodedReturnValue, (bool,uint256));

        /// handle return values of voting call

        /* Case: ContractFeeProposal
         *       -> proposalParameter = 0
         *       -> decodedReturnValue = true ... then changeContractFee
         *       facilitate unlocking of locked Users in ICO contract
         */
        if(proposalParameter == 0) {
            /// update fee if necessary
            if (proposalPassed) {
                payload = abi.encodeWithSignature("getContractFee()");
                (success, encodedReturnValue) = _proposalAddress.call(payload);
                require(success, "could not get new contract fee");
                (uint256 newFee) = abi.decode(encodedReturnValue, (uint256));

                uint256 oldFee = contractFee;
                setFee(newFee);
                emit NewContractFee(oldFee, newFee);
            }
            /// get locked users from proposal to unlock in ICO contract
            payload = abi.encodeWithSignature("getLockedUsers()");
            (success, encodedReturnValue) = _proposalAddress.call(payload);
            require(success, "could not get locked addresses");
            lockedUsers = abi.decode(encodedReturnValue, (address[]));
            // TODO: unlock users in ICO contract
        }
    }

    /// internal

    /// private
    function addMember(address _memberAddress, string memory _memberName) private {
        require(_memberAddress != address(0), "invalid address");
        require(memberId[_memberAddress] == 0, "already a member");

        memberId[_memberAddress] = members.length;
        members.push(Member({
            memberAddress: _memberAddress,
            memberName: _memberName
        }));
    }

    function removeMember(address _memberAddress) private {
        uint256 mId = memberId[_memberAddress];
        require(mId != 0, "the member you want to remove does not exist");

        for(uint256 i = mId; i < getMembersLength() - 1; i++) {
            memberId[members[i + 1].memberAddress]--;
            members[i] = members[i + 1];
        }
        delete members[members.length - 1];
        members.length--;
        memberId[_memberAddress] = 0;
    }

    function setFee(uint256 _val) private {
        contractFee = _val;
    }
}
