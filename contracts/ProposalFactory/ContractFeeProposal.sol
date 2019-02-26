pragma solidity ^0.5.0;

contract ContractFeeProposal {

    /// variables
    address private author;
    uint256 private proposedFee;
    uint256 public numberOfVotes = 0;
    uint256 public numberOfPositiveVotes = 0;
    uint256 private minimumNumberOfVotes;
    uint256 private majorityMargin;
    mapping(address => bool) private voted;
    bool public proposalPassed = false;
    bool public proposalExecuted = false;
    address private management = address(0);

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
        management = _managementContract;
    }

    /// external
    function kill() external {
        require(msg.sender == management, "not called by management contract");
        require(proposalExecuted, "proposal has to be executed first");
        selfdestruct(msg.sender);
    }

    /// public
    /**
     * @return bool proposalPassed, bool proposalExecuted
     */

    function vote(bool _stance, address _origin)
        public
        returns (bool, bool) {
        require(msg.sender == management, "not called by management contract");
        require(!proposalExecuted, "proposal was executed");
        require(!voted[_origin], "you can only vote once");

        voted[_origin] = true;
        numberOfVotes += 1;

        if (_stance == true) {
            numberOfPositiveVotes += 1;
        }
        if ((numberOfVotes >= minimumNumberOfVotes)) {
            execute();
            if (proposalPassed) {
                return(true, true);
            } else {
                // proposalPassed = false | proposalExecuted = true
                return(false, true);
            }
        } else {
            return (false, false);
        }
    }

    function getContractFee() public view returns (uint256) {
        return proposedFee;
    }

    /// internal

    /// private
    function execute() private {
        require(!proposalExecuted, "proposal was executed");
        require(
            numberOfVotes >= minimumNumberOfVotes,
            "requirements for execution not met"
        );

        proposalExecuted = true;
        
        if (((numberOfPositiveVotes * 100) / numberOfVotes) >= majorityMargin) {
            proposalPassed = true;
        } else {
            proposalPassed = false;
        }
    }
}
