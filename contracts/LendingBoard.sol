pragma solidity ^0.5.0;

import "./Ownable.sol";

contract LendingBoard is Ownable {

    /// modifiers

    modifier onlyMembers {
        assert(msg.sender != address(0));
        require(memberID[msg.sender] != 0, "you are not a member");
        _;
    }

    /// structs

    struct Proposal {
        address author;
        uint256 fnNumber;
        uint256 numberOfVotes;
        uint256 positiveVotes;
        bool proposalPassed;
        bool executed;
        Vote[] votes;
        address[] lockedUsers;
        mapping( address => bool ) voted;
        uint256 proposedFee;
        address memberAddress;
        string memberName;
    }

    struct Member {
        address member;
        string name;
    }

    struct Vote {
        bool decision;
        address voter;
    }

    /// variables

    uint256 public minQuorum;
    uint256 public majorityMargin; // in range [0, 100] [%]

    uint256 public contractFee;

    uint256[] public openProposals;
    Proposal[] public proposals;

    mapping( address => uint256 ) public memberID;
    Member[] public members;

    /// events

    event ProposalAdded(uint256 proposalID, string description);
    event Voted(uint256 proposalID, bool stance, address voter);
    event ProposalExecuted(uint256 proposalID, uint256 positiveVotes, uint256 numVotes);
    event MembershipChanged(address member, bool isMember);
    event ContractFeeChanged(uint256 oldFee, uint256 newFee);

    /// constructor

    constructor(
        uint256 _minQuorum,
        uint256 _majorityMargin
    )
        public {

        members.push( Member({
            member: address(0),
            name: "dummy"
        }));
        members.push( Member({
            member: msg.sender,
            name: "Creator"
        }));
        memberID[msg.sender] = 1;

        changeVotingRules(_minQuorum, _majorityMargin);
        contractFee = 1000; // contractFee is 1 ETH represented in Finney ( Milliether )
    }

    /// fallback function

    /// external functions

    function vote(
        uint256 _openProposalIndex,
        bool _stance
    )
        external
        onlyMembers
    {
        require(memberID[msg.sender] != 0, "not a member -> no voting possible");
        uint256 _proposalID = openProposals[_openProposalIndex];
        Proposal storage p = proposals[_proposalID];
        require(!p.voted[msg.sender], "you can only vote once");

        p.voted[msg.sender] = true;
        p.numberOfVotes++;

        if (_stance) {
            p.positiveVotes++;
        }

        p.lockedUsers.push(msg.sender);

        emit Voted(_proposalID, _stance, msg.sender);

        if ((p.numberOfVotes >= minQuorum) && !p.executed) {
            executeProposal(_openProposalIndex);
        }
    }

    /// public functions

    function createFeeProposal(uint256 _proposedFee)
        public
        onlyMembers
        returns (uint256 proposalID) {

        require(_proposedFee >= 100, "proposed fee has to be higher than 100!");
        require(openProposals.length < 25, "too many open proposals");

        proposalID = proposals.length++;
        Proposal storage p = proposals[proposalID];

        p.author = msg.sender;
        p.fnNumber = 0;
        p.numberOfVotes = 0;
        p.positiveVotes = 0;
        p.proposalPassed = false;
        p.executed = false;
        p.proposedFee = _proposedFee;

        emit ProposalAdded(proposalID, "Change Contract Fee");
        openProposals.push(proposalID);

        return proposalID;
    }

    function createMembershipProposal(
        uint256 _fnNumber,
        address _memberAddress,
        string memory _memberName
    )
        public
        onlyMembers
        returns (uint256 proposalID) {

        require(_memberAddress != owner, "cannot change ownership this way");
        require(openProposals.length < 25, "too many open proposals");

        if (_fnNumber == 2) {
            require(memberID[_memberAddress] != 0, "cannot remove a member that does not exist");
        } else if (_fnNumber == 1) {
            require(memberID[_memberAddress] == 0, "the member you want to add exists already");
        }

        proposalID = proposals.length++;
        Proposal storage p = proposals[proposalID];

        p.author = msg.sender;
        p.fnNumber = _fnNumber;
        p.numberOfVotes = 0;
        p.positiveVotes = 0;
        p.proposalPassed = false;
        p.executed = false;
        p.memberAddress = _memberAddress;
        p.memberName = _memberName;

        if ( _fnNumber == 1 ) {
            emit ProposalAdded(proposalID, "Add Member");
        } else if ( _fnNumber == 2 ) {
            emit ProposalAdded(proposalID, "Remove Member");
        }

        openProposals.push(proposalID);

        return proposalID;
    }

    function kill()
        public
        onlyOwner {

        selfdestruct(owner);
    }

    function getMembersLength()
        public
        view
        returns ( uint256 ) {

        return members.length;
    }

    function getOpenProposalsLength()
        public
        view
        returns ( uint256 ) {

        return openProposals.length;
    }

    function getProposalsLength()
        public
        view
        returns ( uint256 ) {

        return proposals.length;
    }

    /// internal functions

    function changeVotingRules(
        uint256 _minQuorum,
        uint256 _majorityMargin
    )
        internal
        onlyMembers {

        minQuorum = _minQuorum;
        majorityMargin = _majorityMargin;

    }

    function setContractFee(
        uint256 _fee
    )
        internal
        onlyMembers {

        uint256 _oldFee = contractFee;
        contractFee = _fee;

        emit ContractFeeChanged(_oldFee, _fee);
    }

    function addMember(
        address _memberAddress,
        string memory _memberName
    )
        internal
        onlyMembers {

        uint256 id = memberID[_memberAddress];
        if (id == 0) {
            memberID[_memberAddress] = members.length;
            id = members.length++;
        }

        members[id] = Member({
            member: _memberAddress,
            name: _memberName
        });

        emit MembershipChanged(_memberAddress, true);

        if (members.length / 2 > minQuorum) {
            changeVotingRules(minQuorum + 1, majorityMargin);
        }
    }

    function removeMember(
        address _memberAddress
    )
        internal
        onlyMembers {

        require(_memberAddress != owner, "Ownership has to be relinquished!");
        require(memberID[_memberAddress] != 0, "Member has to exist");

        /// move member to delete to the end of the array
        for (uint256 i = memberID[_memberAddress]; i < members.length - 1; i++) {
            members[i] = members[i + 1];
        }
        /// delete last member and modify the length
        delete members[members.length - 1];
        members.length--;
        memberID[_memberAddress] = 0;

        emit MembershipChanged(_memberAddress, false);

        if (members.length / 2 <= minQuorum) {
            changeVotingRules(minQuorum - 1, majorityMargin);
        }
    }

    function executeProposal(
        uint256 _openProposalIndex
    )
        internal
        onlyMembers {
        
        uint256 _proposalID = openProposals[_openProposalIndex];
        Proposal storage p = proposals[_proposalID];

        require(p.numberOfVotes >= minQuorum, "proposal did not reach the minimum amount of votes");
        require(!p.executed, "proposal was already executed");

        p.executed = true;

        if (((p.positiveVotes / p.numberOfVotes) * 100) >= majorityMargin) {
            p.proposalPassed = true;

            if (p.fnNumber == 0) {
                setContractFee(p.proposedFee);
            } else if (p.fnNumber == 1) {
                addMember(p.memberAddress, p.memberName);
            } else if (p.fnNumber == 2) {
                removeMember(p.memberAddress);
            }
        } else {
            p.proposalPassed = false;
        }

        for (uint256 i = _openProposalIndex; i < openProposals.length - 1; i++) {
            openProposals[i] = openProposals[i + 1];
        }
        delete openProposals[openProposals.length - 1];
        openProposals.length--;

        emit ProposalExecuted(_proposalID, p.positiveVotes, p.numberOfVotes);
    }

    /// private functions
}
