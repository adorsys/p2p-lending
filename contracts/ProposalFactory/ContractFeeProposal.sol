pragma solidity ^0.5.0;

contract ContractFeeProposal {

    modifier onlyManagementContract {
        require(
            msg.sender == managementContract,
            "can only be called by management contract"
        );
        _;
    }

    /// events

    event ProposalExecuted(
        address ContractFeeProposal,
        uint256 numberOfPositiveVotes,
        uint256 numberOfVotes
    );

    /// variables

    address payable private managementContract;
    address public author;
    uint256 public proposedFee;
    uint256 public numberOfVotes = 0;
    uint256 public numberOfPositiveVotes = 0;
    uint256 public minimumNumberOfVotes;
    uint256 public majorityMargin;
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
        address payable _managementContract
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
        address payable _managementContract
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

        if (((numberOfPositiveVotes * 100) / numberOfVotes) >= majorityMargin) {
            proposalPassed = true;
            bytes memory payload = abi.encodeWithSignature("setContractFee(uint256)", proposedFee);
            (bool success, ) = managementContract.call(payload);
            require(success, "setting of contractFee failed");
            selfdestruct(managementContract);
        }
    }
}