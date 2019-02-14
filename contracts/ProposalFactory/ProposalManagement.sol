pragma solidity ^0.5.0;

import "./ProposalFactory.sol";

contract ProposalManagement {
    struct Member {
        address memberAddress;
        string memberName;
    }

    ProposalFactory private proposalFactory;

    mapping(address => address[]) private proposals;
    mapping(address => bool) private allowedAddresses;
    mapping(address => uint256) private memberId;

    uint256 public contractFee;
    Member[] public members;

    modifier onlyKnownAddresses() {
        require(allowedAddresses[msg.sender], "unknown address");
        _;
    }

    modifier onlyMembers() {
        require(memberId[msg.sender] != 0, "you need to be a member");
        _;
    }

    event SetContractFeeFrom(address callId);

    /// constructor
    constructor()
        public {
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

    function getProposals()
        public
        view
        returns (address[] memory) {
        return(proposals[address(this)]);
    }

    function addMember(
        address _memberAddress,
        string memory _memberName
    )
        public
        onlyMembers {
        require(_memberAddress != address(0), "invalid address");
        require(memberId[_memberAddress] == 0, "already a member");
        memberId[_memberAddress] = members.length;
        members.push(Member({
            memberAddress: _memberAddress,
            memberName: _memberName
        }));
    }

    function createContractFeeProposal(uint256 _proposedFee)
        public {
        address proposal = proposalFactory.newContractFeeProposal(_proposedFee, msg.sender);
        proposals[address(this)].push(proposal);
        allowedAddresses[proposal] = true;
    }

    function setContractFee(uint256 _proposedFee)
        public
        onlyKnownAddresses {
        emit SetContractFeeFrom(msg.sender);
        contractFee = _proposedFee;
    }

    function vote(bool _stance, address _proposal) public onlyMembers {
        bytes memory payload = abi.encodeWithSignature("vote(bool, address)", _stance, msg.sender);
        (bool success, ) = _proposal.call(payload);
        require(success, "voting failed");
    }

    /// internal

    /// private
}