const ProposalFactory = artifacts.require(
    "./ProposalFactory/ProposalFactory.sol"
);
const ProposalManagement = artifacts.require(
    "./ProposalFactory/ProposalManagement.sol"
);
const ContractFeeProposal = artifacts.require(
    "./ProposalFactory/ContractFeeProposal.sol"
);

contract("ProposalFactory", accounts => {
    beforeEach(async () => {
        author = accounts[0];
        secondVoter = accounts[1];
        proposedFee = web3.utils.toWei("1000", "finney");
        managementContract = await ProposalManagement.deployed();
        proposalFactory = await ProposalFactory.deployed();
        contractFeeProposal = await proposalFactory.newContractFeeProposal(
            proposedFee,
            managementContract.address
        );
        contractFeeProposalAddress = (await proposalFactory.getProposals.call())[0];
        contractFeeProposalInstance = await ContractFeeProposal.at(
            contractFeeProposalAddress
        );
    });

    it("Creates ContractFeeProposal", async () => {
        assert.notStrictEqual(
            contractFeeProposalAddress,
            0x0000000000000000000000000000000000000000,
            "should create a valid proposal contract"
        );
    });
});
