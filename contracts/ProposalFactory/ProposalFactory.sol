pragma solidity ^0.5.0;

import "./ContractFeeProposal.sol";
import "./MemberProposal.sol";

contract ProposalFactory {
    /// constructor
    /// fallback

    function() external payable {
        revert("ProposalFactory does not accept payments");
    }

    /// external

    function newProposal(
        uint256 _proposedFee,
        uint256 _minimumNumberOfVotes,
        uint256 _majorityMargin
    )
        external
        returns(address proposal) {
        
        proposal = address(
            new ContractFeeProposal(
                msg.sender,
                _proposedFee,
                _minimumNumberOfVotes,
                _majorityMargin,
                msg.sender
            )
        );
    }

    function newProposal(
        address _memberAddress,
        bool _adding,
        uint256 _minimumNumberOfVotes,
        uint256 _majorityMargin
    )
        external
        returns (address proposal) {
        
        proposal = address(
            new MemberProposal(
                msg.sender,
                _memberAddress,
                _adding,
                _minimumNumberOfVotes,
                _majorityMargin,
                msg.sender
            )
        );
    }
    
    /// public
    /// internal
    /// private
}
