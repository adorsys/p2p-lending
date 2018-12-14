pragma solidity >=0.4.22;

import "./Ownable.sol";

contract LendingBoard is Ownable {

    /// modifiers
    modifier onlyMembers {
        uint256 mID = memberID[msg.sender];

        if ( mID == 0 ) {
            require(msg.sender == owner, "you are not the owner or a member of the board");
            _;
        } else {
            require(mID != 0, "you are not a member");
            _;
        }
    }

    /// structs
    struct Proposal {
        address author;
        uint8 fnNumber;
        uint256 numberOfVotes;
        uint256 positiveVotes;
        uint256 minExecutionDate;
        bool proposalPassed;
        bool executed;
        Vote[] votes;
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
    uint256 public debateTime;
    uint8 public majorityMargin;

    uint256 public contractFee;

    uint256[] public openProposals;
    Proposal[] public proposals;

    mapping( address => uint256 ) public memberID;
    Member[] public members;

    /// events
    event ProposalAdded( uint256 _proposalID, string _description );
    event Voted( uint256 _proposalID, bool _stance, address _voter );
    event ProposalExecuted( uint256 _proposalID, uint256 _positiveVotes, uint256 _numVotes, bool _executed );
    event MembershipChanged( address _member, bool _isMember );
    event ContractFeeChanged( uint256 _oldFee, uint256 _newFee );

    /// constructor
    constructor
    (
            uint256 _minQuorum,
            uint256 _minsForDebate,
            uint8 _majorityMargin
    )
        public {

        changeVotingRules(_minQuorum, _minsForDebate, _majorityMargin);
        contractFee = 1000;
        addMember(msg.sender, "owner");
    }

    /// Getter
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

    /// Setter
    function changeVotingRules
    (
        uint256 _minQuorum,
        uint256 _minsForDebate,
        uint8 _majorityMargin
    )
        internal
        onlyMembers {

        minQuorum = _minQuorum;
        debateTime = _minsForDebate;
        majorityMargin = _majorityMargin;

    }

    function setContractFee
    (
        uint256 _fee
    )
        internal
        onlyMembers {
        
        uint256 _oldFee = contractFee;
        contractFee = _fee;

        emit ContractFeeChanged(_oldFee, _fee);
    }

    /// internal functions
    function addMember
    (
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
    }

    function removeMember
    (
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
    }

    function createFeeProposal
    (
        uint256 _proposedFee
    )
        public
        onlyMembers
        returns ( uint256 proposalID ) {

        require(_proposedFee >= 100, "proposed fee has to be higher than 100!");

        proposalID = proposals.length++;
        Proposal storage p = proposals[proposalID];

        p.author = msg.sender;
        p.fnNumber = 0;
        p.numberOfVotes = 0;
        p.positiveVotes = 0;
        p.minExecutionDate = now + debateTime * 1 minutes;
        p.proposalPassed = false;
        p.executed = false;
        p.proposedFee = _proposedFee;

        emit ProposalAdded(proposalID, "Change Contract Fee");
        openProposals.push(proposalID);

        return proposalID;
    }

    function createMembershipProposal
    (
        uint8 _fnNumber,
        address _memberAddress,
        string memory _memberName
    )
        public
        onlyMembers
        returns ( uint256 proposalID ) {

        require(_memberAddress != owner, "cannot change ownership this way");

        if ( _fnNumber == 2 ) {
            require(memberID[_memberAddress] != 0, "cannot remove a member that does not exist");
        } else if ( _fnNumber == 1) {
            require(memberID[_memberAddress] == 0, "the member you want to add exists already");
        }

        proposalID = proposals.length++;
        Proposal storage p = proposals[proposalID];

        p.author = msg.sender;
        p.fnNumber = _fnNumber;
        p.numberOfVotes = 0;
        p.positiveVotes = 0;
        p.minExecutionDate = now + debateTime * 1 minutes;
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

    function vote
    (
        uint256 _proposalID,
        bool _stance
    )
        public
        onlyMembers
        returns (uint256 voteID) {
        
        Proposal storage p = proposals[_proposalID];
        require(!p.voted[msg.sender], "you can only vote once");

        p.voted[msg.sender] = true;
        p.numberOfVotes++;

        if (_stance) {
            p.positiveVotes++;
        }

        emit Voted(_proposalID, _stance, msg.sender);
        return p.numberOfVotes;
    }

    function executeProposal
    (
        uint256 _proposalID
    )
        public
        onlyMembers {
        
        Proposal storage p = proposals[_proposalID];

        require(now >= p.minExecutionDate, "debating time has not passed yet");
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

        for (uint256 i = _proposalID; i < openProposals.length - 1; i++) {
            openProposals[i] = openProposals[i + 1];
        }
        delete openProposals[openProposals.length - 1];
        openProposals.length--;

        emit ProposalExecuted(_proposalID, p.positiveVotes, p.numberOfVotes, p.executed);
    }
}
