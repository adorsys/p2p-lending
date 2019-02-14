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

    function newContractFeeProposal(uint256 _proposedFee, address _origin)
        public
        returns(address contractFeeProposal) {

        uint256 minimumNumberOfVotes = getMinimumNumberOfVotes();
        uint256 majorityMargin = getMajorityMargin();
        
        contractFeeProposal = address(new ContractFeeProposal(
            _origin,
            _proposedFee,
            minimumNumberOfVotes,
            majorityMargin,
            msg.sender
        ));
    }

    function castVote(
        address payable _proposalAddress,
        bool _stance
    )
        public {
        
        ContractFeeProposal proposal = ContractFeeProposal(_proposalAddress);
        proposal.vote(_stance, msg.sender);
    }

    /// internal

    function getMinimumNumberOfVotes()
        internal
        pure
        returns (uint256) {
        
        return 1;
    }

    function getMajorityMargin()
        internal
        pure
        returns (uint256) {
        
        return 50;
    }

    /// private
}