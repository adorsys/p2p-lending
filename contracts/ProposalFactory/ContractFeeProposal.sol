pragma solidity ^0.5.0;

contract ContractFeeProposal {
    /// events
    event ProposalExecuted(
        address ContractFeeProposal,
        uint256 numberOfPositiveVotes,
        uint256 numberOfVotes
    );

    /// variables
    address private author;
    uint256 private proposedFee;
    uint256 private numberOfVotes = 0;
    uint256 private numberOfPositiveVotes = 0;
    uint256 private minimumNumberOfVotes;
    uint256 private majorityMargin;
    mapping(address => bool) private voted;
    bool private proposalPassed = false;
    bool private proposalExecuted = false;
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
    ) public {
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

    function getContractFee() public view returns (uint256) {
        return proposedFee;
    }

    function getCurrentNumberOfVotes() public view returns (uint256) {
        return numberOfVotes;
    }

    function vote(bool _stance, address _origin)
        public
        returns (bool) {
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
                return(true);
            } else {
                return(false);
            }
        } else {
            return (false);
        }
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
        emit ProposalExecuted(address(this), numberOfVotes, numberOfPositiveVotes);
        if (((numberOfPositiveVotes * 100) / numberOfVotes) >= majorityMargin) {
            proposalPassed = true;
        } else {
            proposalPassed = false;
        }
    }
}
