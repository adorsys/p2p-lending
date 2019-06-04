const ProposalFactory = artifacts.require("ProposalFactory");

contract("ProposalFactory", accounts => {
    // smart contract
    let proposalFactory;

    // values
    const address0 = 0x0000000000000000000000000000000000000000;
    const proposedFee = web3.utils.toWei(String(4), "ether");
    const minimumNumberOfVotes = 1;
    const majorityMargin = 50;
    const newMember = accounts[9];

    beforeEach(async () => {
        firstAccount = accounts[0];
        proposalFactory = await ProposalFactory.new();
    });

    it("can create a newContractFeeProposal", async () => {
        // factory returns address of created proposal
        retVal = await proposalFactory.newContractFeeProposal.call(
            proposedFee,
            minimumNumberOfVotes,
            majorityMargin
        );
        assert.notStrictEqual(
            retVal,
            String(address0),
            "invalid return for contractFeeProposal"
        );
    });

    it("can create a newMemberProposal", async () => {
        retVal = await proposalFactory.newMemberProposal.call(
            newMember,
            true,
            minimumNumberOfVotes,
            majorityMargin
        );
        assert.notStrictEqual(
            retVal,
            String(address0),
            "invalid return for newMemberProposal"
        );
    });
});
