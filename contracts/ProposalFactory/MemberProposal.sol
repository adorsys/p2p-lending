pragma solidity ^0.5.0;

contract MemberProposal {
    address private author;
    address private management = address(0);
    address public memberAddress;
    bool public adding;
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
        address _author,
        address _memberAddress,
        bool _adding,
        uint256 _minimumNumberOfVotes,
        uint256 _majorityMargin,
        address _managementContract
    ) public {
        author = _author;
        memberAddress = _memberAddress;
        adding = _adding;
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
        selfdestruct(msg.sender);
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

        if (_stance) {
            numberOfPositiveVotes++;
        }

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
     * @notice gets the address of the member
     * @return memberAddress of the proposal
     */
    function getMemberAddress() public view returns (address) {
        return memberAddress;
    }

    /**
     * @notice executes the proposal and updates the internal state
     */
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
