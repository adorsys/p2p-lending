pragma solidity ^0.5.0;

import "./ContractFeeProposal.sol";
import "./MemberProposal.sol";

contract ProposalFactory {
    function() external payable {
        revert("ProposalFactory does not accept payments");
    }

    /**
     * @notice creates a new contractFee proposal
     * @param _proposedFee the suggested new fee
     * @param _minimumNumberOfVotes the minimum number of votes needed to execute the proposal
     * @param _majorityMargin the percentage of positive votes needed for proposal to pass
     */
    function newProposal(
        uint256 _proposedFee,
        uint256 _minimumNumberOfVotes,
        uint256 _majorityMargin
    ) external returns(address proposal) {
        proposal = address(
            new ContractFeeProposal(
                _proposedFee,
                _minimumNumberOfVotes,
                _majorityMargin,
                msg.sender
            )
        );
    }

    /**
     * @notice creates a new member proposal
     * @param _memberAddress address of the member
     * @param _adding true to add member - false to remove member
     * @param _minimumNumberOfVotes the minimum number of votes needed to execute the proposal
     * @param _majorityMargin the percentage of positive votes needed for proposal to pass
     */
    function newProposal(
        address _memberAddress,
        bool _adding,
        uint256 _minimumNumberOfVotes,
        uint256 _majorityMargin
    ) external returns (address proposal) {
        proposal = address(
            new MemberProposal(
                _memberAddress,
                _adding,
                _minimumNumberOfVotes,
                _majorityMargin,
                msg.sender
            )
        );
    }
}
