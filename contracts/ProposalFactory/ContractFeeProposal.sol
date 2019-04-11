pragma solidity ^0.5.0;

contract ContractFeeProposal {
    address payable private management;
    uint256 private proposedFee;
    uint8 private majorityMargin;
    uint16 private minimumNumberOfVotes;
    uint16 public numberOfVotes;
    uint16 public numberOfPositiveVotes;

    mapping(address => bool) private voted;
    bool public proposalPassed;
    bool public proposalExecuted;

    constructor(
        uint256 _proposedFee,
        uint16 _minimumNumberOfVotes,
        uint8 _majorityMargin,
        address payable _managementContract
    ) public {
        proposedFee = _proposedFee;
        minimumNumberOfVotes = _minimumNumberOfVotes;
        majorityMargin = _majorityMargin;
        management = _managementContract;
    }

    /**
     * @notice destroys the proposal contract and forwards the remaining funds to the management contract
     */
    function kill() external {
        require(msg.sender == management, "invalid caller");
        require(proposalExecuted, "!executed");
        selfdestruct(management);
    }

    /**
     * @notice registers a vote for the proposal and triggers execution if conditions are met
     * @param _stance true for a positive vote - false otherwise
     * @param _origin the address of the initial function call
     * @return propPassed true if proposal met the required number of positive votes - false otherwise
     * @return propExecuted true if proposal met the required minimum number of votes - false otherwise
     */
    function vote(bool _stance, address _origin) external returns (bool propPassed, bool propExecuted) {
        // check input parameters
        require(msg.sender == management, "invalid caller");
        require(!proposalExecuted, "executed");
        require(!voted[_origin], "second vote");

        // update internal state
        voted[_origin] = true;
        numberOfVotes += 1;

        if (_stance) numberOfPositiveVotes++;

        // check if execution of proposal should be triggered and update return values
        if ((numberOfVotes >= minimumNumberOfVotes)) {
            execute();
            if (proposalPassed) {
                propPassed = true;
                propExecuted = true;
            } else {
                propPassed = false;
                propExecuted = false;
            }
        } else {
            propPassed = false;
            propExecuted = false;
        }
    }

    /**
     * @notice gets the proposed new contract fee
     * @return the proposed new fee
     */
    function getContractFee() external view returns (uint256) {
        return proposedFee;
    }

    /**
     * @notice executes the proposal and updates the internal state
     */
    function execute() private {
        // check internal state
        require(!proposalExecuted, "executed");
        require(
            numberOfVotes >= minimumNumberOfVotes,
            "cannot execute"
        );

        // update the internal state
        proposalExecuted = true;
        
        if (((numberOfPositiveVotes * 100) / numberOfVotes) >= majorityMargin) {
            proposalPassed = true;
        } else {
            proposalPassed = false;
        }
    }
}
