pragma solidity ^0.4.22;
import "./Ownable.sol";
import "./string_utils.sol";

contract Base {

    function setContractFee(uint256) public pure returns (uint256) {}

    function contractFee() public pure returns (uint256) {}
}

contract lending_board is Ownable {

    // variables and events

    uint256 public minimumQuorum;
    uint256 public debatingPeriodInMinutes;
    uint8 public majorityMargin;
    Proposal[] public Proposals;
    uint256 public numProposals;
    mapping (address => uint256) private memberID;
    Member[] public members;
    Base private lC;
    string_utils private utils;
    uint256[] public openProposals;
    uint256 public numOpenProposals;


    event ProposalAdded(uint256 ProposalID, string description);
    event Voted(uint256 ProposalID, bool position, address voter);
    event ProposalTallied(uint256 proposalID, uint256 result, uint256 quorum, bool active);
    event MembershipChanged(address member, bool isMember);
    event ChangeOfRules(uint256 newMinimumQuorum, uint256 newDebatingPeriodInMinutes, int newMajorityMargin);

    struct Proposal {
        address author;
        string description;
        bool executed;
        bool proposalPassed;
        uint256 numberOfVotes;
        uint256 positiveVotes;
        Vote[] votes;
        mapping (address => bool) voted;
        uint256 minExecutionDate;
        uint256 proposedFee;
        address memberAddress;
        string memberName;
    }

    struct Member {
        address member;
        string name;
    }

    struct Vote {
        bool inSupport;
        address voter;
        string justification;
    }

    // modifier so that only stakeholders can vote and create new proposals
    modifier onlyMembers {
        require(memberID[msg.sender] != 0, "Not A Member");
        // code with modifier gets pasted to _ position
        _;
    }

    constructor(
        uint256 _minQuorum, uint256 _minsForDebate, 
        uint8 _majorityMargin, address _contractAddr) 
        public {

        changeVotingRules(_minQuorum, _minsForDebate, _majorityMargin);
        require(_contractAddr != 0, "Provide a valid address to the lending contract");
        setBaseAddress(_contractAddr);
        utils = new string_utils();
        // openProposals.push(2**256 - 1);

        // dummy member so contract owner is also a member as onlyMembers checks against 0
        addMember(0, "0xd3adb33f");
        // add owner as founder
        addMember(owner, "founder");
    }

    /**
     * Specify the address of the contract
     *
     * @param _addr address of the deployed smart contract
     */

    function setBaseAddress(address _addr) 
        public 
        onlyOwner {
            
        require(_addr != 0, "provide a valid address");
        lC = Base(_addr);
    }

    /**
     * changes the contract proposedFee in the Base contract of p2p_lending
     *
     * @param _proposalID Id of the proposal to check against if valid change
     */

    function changeContractFee(uint256 _proposalID) 
        private 
        view {

        Proposal storage p = Proposals[_proposalID];
        require(p.proposedFee != 0, "contract fee cannot be 0");
        setFee(p.proposedFee);
    }

    /**
     * Add Member
     *
     * Make 'targetMember' a member named 'memberName'
     *
     * @param _targetMember ethereum address of the member to be added
     * @param _memberName public name for that member - can be freely chosen
     */

    function addMember(
        address _targetMember, string _memberName) 
        private 
        onlyOwner {
            
        uint256 id = memberID[_targetMember];
        if (id == 0) {
            memberID[_targetMember] = members.length;
            id = members.length++;
        }

        members[id] = Member({
            member: _targetMember,
            name: _memberName
        });

        emit MembershipChanged(_targetMember, true);
    }

    /**
     * Remove Member
     *
     * @notice Revoke membership of 'targetMember'
     *
     * @param _targetMember ethereum address of the member to be removed
     */

    function removeMember(address _targetMember) 
        private 
        onlyOwner {

        require(memberID[_targetMember] != 0, "Do not delete the first Member");

        // move member to delete to the end of the array
        for (uint256 i = memberID[_targetMember]; i < members.length - 1; i++) {
            members[i] = members[i + 1];
        }
        // delete last member and modify the length
        delete members[members.length - 1];
        members.length--;

        emit MembershipChanged(_targetMember, false);
    }

    /**
     * Change Voting Rules
     *
     * proposal need to be discussed for at least 'minutesForDebate', have atleast 'minimumQuorumForProposals' voting members
     * and needs to reach 50% + 'marginOfVotesForMajority' of the votes to be executed
     *
     * @param _minimumQuorumForProposals specifiy how many members have to vote on a proposal for it to be executed
     * @param _minutesForDebate specifies the minimum amount of delay between the proposal and the execution of the proposal
     * @param _marginOfVotesForMajority the proposal needs to have 50% + margin to pass
     */

    function changeVotingRules(
        uint256 _minimumQuorumForProposals, uint256 _minutesForDebate, 
        uint8 _marginOfVotesForMajority) 
        public 
        onlyOwner {

        minimumQuorum = _minimumQuorumForProposals;
        debatingPeriodInMinutes = _minutesForDebate;
        majorityMargin = _marginOfVotesForMajority;

        emit ChangeOfRules(_minimumQuorumForProposals, _minutesForDebate, _marginOfVotesForMajority);
    }

    function createProposalStump(
        string _proposalDescription, address _author)
        private
        onlyMembers
        returns (uint256 proposalID) {

        proposalID = Proposals.length++;
        Proposal storage p = Proposals[proposalID];

        p.author = _author;
        p.description = _proposalDescription;
        p.executed = false;
        p.proposalPassed = false;
        p.numberOfVotes = 0;
        p.positiveVotes = 0;
        p.minExecutionDate = now + debatingPeriodInMinutes * 1 minutes;

    }

    /**
     * Add proposal using the (if aviailiable) empty slots in Proposals
     *
     * @param _proposalDescription Description of proposal
     * @param _proposedFee amount the transaction fee to borrow money should be changed to
     */

    function newProposal(
        string _proposalDescription, uint256 _proposedFee)
        public 
        onlyMembers 
        returns (uint256 proposalID) {

        proposalID = createProposalStump(_proposalDescription, msg.sender);
        Proposal storage p = Proposals[proposalID];

        p.proposedFee = _proposedFee;

        emit ProposalAdded(proposalID, _proposalDescription);
        openProposals.push(proposalID);
        numProposals++;
        numOpenProposals++;

        return proposalID;
    }

    function newProposal(
        string _proposalDescription, 
        address _targetAddress, string _memberName
        )
        public
        onlyMembers
        returns (uint256 proposalID) {
        
        proposalID = createProposalStump(_proposalDescription, msg.sender);
        Proposal storage p = Proposals[proposalID];

        p.memberAddress = _targetAddress;
        p.memberName = _memberName;

        emit ProposalAdded(proposalID, _proposalDescription);
        openProposals.push(proposalID);
        numProposals++;
        numOpenProposals++;

    }

    /**
     * Log a vote for a proposal
     *
     * @param _proposalNumber number of proposal
     * @param _supportsProposal in favor true - against it false
     */

    function vote(uint256 _proposalNumber, bool _supportsProposal)
        public
        onlyMembers 
        returns (uint256 voteID) {

        Proposal storage p = Proposals[_proposalNumber];
        require(!p.voted[msg.sender], "You already voted!");

        p.voted[msg.sender] = true;
        p.numberOfVotes++;

        if (_supportsProposal) {
            p.positiveVotes++;
        }

        emit Voted(_proposalNumber, _supportsProposal, msg.sender);
        return p.numberOfVotes;
    }

    /**
     * execute the proposals after the required voting time has passed
     *
     * @param _proposalNumber proposal number
     */

    function executeProposal(uint256 _proposalNumber)
        private 
        onlyOwner {

        Proposal storage p = Proposals[_proposalNumber];

        require(now > p.minExecutionDate, "Can only be executed after the voting deadline");
        require(!p.executed, "Was already executed");
        require(p.numberOfVotes >= minimumQuorum, "Did not get minimum amount of votes necessary");

        if (((p.positiveVotes / p.numberOfVotes) * 100) > majorityMargin) {
            // prevent recursive calls
            p.executed = true;

            // execute proposals
            // proposal to change contract proposedFee

            if (utils.compareStrings(p.description, "change fee")) {
                changeContractFee(_proposalNumber);
            }

            // proposal to add a new member to the board

            else if (utils.compareStrings(p.description, "add member")) {
                addMember(p.memberAddress, p.memberName);
            }

            // proposal to remove a given member from the board

            else if (utils.compareStrings(p.description, "remove member")) {
                removeMember(p.memberAddress);
            }

            p.proposalPassed = true;
        } else {
            p.executed = true;
            p.proposalPassed = false;
        }

        emit ProposalTallied(_proposalNumber, p.positiveVotes, p.numberOfVotes, p.proposalPassed);

    }

    /**
     * executes the first proposal in openProposals that meets the execution criteria
     * afterwards removes the executed proposal from openProposals
     * 
     * @return uint256 the ID of the proposal that was executed
     */

    function automatedExecute()
        public
        onlyMembers
        returns (uint256 proposalID) {

        require(openProposals.length != 0, "No Open Proposals to execute");
        require(Proposals.length != 0, "No Proposals have been created yet");

        // max uint256 to prevent executing proposal 0 multiple times
        proposalID = 2**256 - 1;
        
        for (uint256 i = 0; i < openProposals.length; i++) {
            Proposal storage p = Proposals[openProposals[i]];
            if (now > p.minExecutionDate) {
                proposalID = openProposals[i];
                for (uint j = i; j < openProposals.length - 1; j++) {
                    openProposals[j] = openProposals[j + 1];
                }
                delete openProposals[openProposals.length - 1];
                openProposals.length--;
                break;
            }
        }
        
        require(proposalID < Proposals.length, "Probably out of bounds.");
        
        executeProposal(proposalID);
        numOpenProposals--;
    }

    /**
     * sets the contract fee in the base p2p-lending contract
     *
     * @param _fee the new fee in the base p2p-lending contract
     * @return the changed fee
     */

    function setFee(uint256 _fee) 
        private 
        view 
        returns (uint256 result) {

        lC.setContractFee(_fee);
        return _fee;
    }

    /**
     * get the current fee in the base p2p-lending contract
     *
     * @return current fee in the base p2p-lending contract
     */

    function getFee() 
        public 
        view 
        returns (uint256 result) {

        return lC.contractFee();
    }
}
