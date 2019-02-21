pragma solidity ^0.5.0;

import "./ContractFeeProposal.sol";

contract ProposalFactory {
    /// constructor
    /// fallback
    function() external payable {
        revert("ProposalFactory does not accept payments");
    }
    /// external
    /// public
    function newContractFeeProposal(
        uint256 _proposedFee,
        uint256 _minimumNumberOfVotes,
        uint256 _majorityMargin    
    )
        public
        returns(address contractFeeProposal) {

        contractFeeProposal = address(
            new ContractFeeProposal(
                msg.sender,
                _proposedFee,
                _minimumNumberOfVotes,
                _majorityMargin,
                msg.sender
            )
        );
    }

    /// internal
    /// private
}
