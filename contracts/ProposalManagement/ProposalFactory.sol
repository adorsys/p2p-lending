pragma solidity ^0.5.0;

import "./ContractFeeProposal.sol";
import "./MemberProposal.sol";

contract ProposalFactory {
    /**
     * @notice creates a new contractFee proposal
     * @param _proposedFee the suggested new fee
     * @param _minimumNumberOfVotes the minimum number of votes needed to execute the proposal
     * @param _majorityMargin the percentage of positive votes needed for proposal to pass
     */
    function newContractFeeProposal(
        uint256 _proposedFee,
        uint16 _minimumNumberOfVotes,
        uint8 _majorityMargin
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
     * @param _trusteeCount the current number of TrustToken-Holders
     * @param _majorityMargin the percentage of positive votes needed for proposal to pass
     */
    function newMemberProposal(
        address _memberAddress,
        bool _adding,
        uint256 _trusteeCount,
        uint8 _majorityMargin
    ) external returns (address proposal) {
        // calculate minimum number of votes for member proposal
        uint256 minVotes = _trusteeCount / 2;

        // ensure that minVotes > 0
        minVotes = minVotes == 0 ? (minVotes + 1) : minVotes;

        proposal = address(
            new MemberProposal(
                _memberAddress,
                _adding,
                minVotes,
                _majorityMargin,
                msg.sender
            )
        );
    }
}
