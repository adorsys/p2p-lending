const ProposalFactory = artifacts.require(
    "./ProposalFactory/ProposalFactory.sol"
);

contract("ProposalFactory", accounts => {
    before(async () => {
        proposalFactory = await ProposalFactory.deployed();
    });

    it("Creates ContractFeeProposal", async () => {
        await proposalFactory.newContractFeeProposal(1000);
        let address = await proposalFactory.getProposals.call();
        assert.notStrictEqual(
            address,
            0x0000000000000000000000000000000000000000,
            "should create a valid proposal contract"
        );
    });
});
