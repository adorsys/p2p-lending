pragma solidity ^0.5.0;

import "./ContractFeeProposal.sol";

contract ProposalFactory {

    // address lendingBoardInstance;
    mapping(address => address[]) proposals;
    
    /// constructor

    constructor() public {
        // lendingBoardInstance = _lendingBoardAddress;
    }

    /// fallback

    function() external payable {
        revert("ProposalFactory does not accept payments");
    }

    /// external

    /// public

    function newContractFeeProposal(uint256 _proposedFee)
        public
        returns(address payable contractFeeProposal) {

        uint256 minimumNumberOfVotes = getMinimumNumberOfVotes();
        uint256 majorityMargin = getMajorityMargin();
        
        contractFeeProposal = address(
            new ContractFeeProposal(
                msg.sender,
                _proposedFee,
                minimumNumberOfVotes,
                majorityMargin,
                address(this) // FOR TESTING UPDATE FOR ACTUAL USE
            )
        );

        proposals[address(this)].push(contractFeeProposal);
    }

    function castVote(
        address payable _proposalAddress,
        bool _stance
    )
        public {
        
        ContractFeeProposal proposal = ContractFeeProposal(_proposalAddress);
        proposal.vote(_stance, msg.sender);
    }

    function getProposals()
        public
        view
        returns(address[] memory) {
        
        return(proposals[address(this)]);
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