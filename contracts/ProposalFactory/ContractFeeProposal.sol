pragma solidity ^0.5.0;

contract ContractFeeProposal {
    address payable private management = address(0);
    uint256 private proposedFee;
    uint256 private majorityMargin;
    uint256 private minimumNumberOfVotes;

    mapping(address => bool) private voted;
    uint256 public numberOfVotes = 0;
    uint256 public numberOfPositiveVotes = 0;
    bool public proposalPassed = false;
    bool public proposalExecuted = false;

    function() external payable {
        revert("Proposals do not accept payments");
    }

    constructor(
        uint256 _proposedFee,
        uint256 _minimumNumberOfVotes,
        uint256 _majorityMargin,
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
        require(msg.sender == management, "not called by management contract");
        require(proposalExecuted, "proposal has to be executed first");
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
        require(msg.sender == management, "not called by management contract");
        require(!proposalExecuted, "proposal was executed");
        require(!voted[_origin], "you can only vote once");

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
    function getContractFee() public view returns (uint256) {
        return proposedFee;
    }

    /**
     * @notice executes the proposal and updates the internal state
     */
    function execute() private {
        // check internal state
        require(!proposalExecuted, "proposal was executed");
        require(
            numberOfVotes >= minimumNumberOfVotes,
            "requirements for execution not met"
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
