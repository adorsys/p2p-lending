pragma solidity ^0.5.0;

interface LendingBoard {
    function executeProposal() external;
    function setContractFee(uint256) external;
}

contract ContractFeeProposal {

    event ProposalExecuted(
        address ContractFeeProposal,
        uint256 numberOfPositiveVotes,
        uint256 numberOfVotes
    );

    modifier onlyManagementContract {
        require(
            msg.sender == managementContract,
            "can only be called by management contract"
        );
        _;
    }

    /// events

    /// struct

    struct Vote {
        address voter;
        bool stance;
    }

    /// variables

    address private managementContract;
    address public author;
    uint256 private proposalIdentifier = 0;
    uint256 public proposedFee;
    uint256 public numberOfVotes = 0;
    uint256 public numberOfPositiveVotes = 0;
    uint256 public minimumNumberOfVotes;
    uint256 public majorityMargin;
    Vote[] private votes;
    mapping(address => bool) private voted;
    bool public proposalPassed = false;
    bool public proposalExecuted = false;
    address[] private lockedUsers;

    /// fallback

    function() external payable {
        revert("Proposals do not accept payments");
    }

    /// constructor

    constructor(
        address _author,
        uint256 _proposedFee,
        uint256 _minimumNumberOfVotes,
        uint256 _majorityMargin,
        address _managementContract
    )
        public {
        
        author = _author;
        proposedFee = _proposedFee;
        minimumNumberOfVotes = _minimumNumberOfVotes;
        majorityMargin = _majorityMargin;
        managementContract = _managementContract;
    }

    /// external

    function vote(bool _stance, address _origin)
        external
        onlyManagementContract {
        
        require(!proposalExecuted, "proposal was executed");
        require(!voted[_origin], "you can only vote once");

        voted[_origin] = true;
        lockedUsers.push(_origin);
        numberOfVotes += 1;

        if (_stance == true) {
            numberOfPositiveVotes += 1;
        }

        if ((numberOfVotes >= minimumNumberOfVotes)) {
            execute();
        }
    }

    function updateManagementContract(
        address _managementContract
    )
        external
        onlyManagementContract {
        
        managementContract = _managementContract;
    }

    /// public

    /// internal

    /// private

    function execute()
        private
    {
        
        require(!proposalExecuted, "proposal was executed");
        require(
            numberOfVotes >= minimumNumberOfVotes,
            "requirements for execution not met"
        );

        proposalExecuted = true;
        emit ProposalExecuted(address(this), numberOfPositiveVotes, numberOfVotes);

        // if (((numberOfPositiveVotes * 100) / numberOfVotes) >= majorityMargin) {
        //     proposalPassed = true;
        //     LendingBoard(managementContract).setContractFee(proposedFee);
        // }
    }
}