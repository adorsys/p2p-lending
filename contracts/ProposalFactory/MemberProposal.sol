pragma solidity ^0.5.0;

contract MemberProposal {
    /// variables
    
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

    /// fallback

    function() external payable {
        revert("Proposals do not accept payments");
    }

    /// constructor

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

    /// external

    function kill() external {
        require(msg.sender == management, "not called by management contract");
        require(proposalExecuted, "proposal has to be executed first");
        selfdestruct(msg.sender);
    }

    /// public

    function vote(bool _stance, address _origin) public returns (bool, bool) {
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
                return (true, true);
            } else {
                return (false, true);
            }
        } else {
            return (false, false);
        }
    }

    function getMemberAddress() public view returns (address) {
        return memberAddress;
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
