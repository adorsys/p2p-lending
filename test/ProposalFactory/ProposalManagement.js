const ProposalManagement = artifacts.require(
    "./ProposalFactory/ProposalManagement.sol"
);
const ContractFeeProposal = artifacts.require(
    "./ProposalFactory/ContractFeeProposal.sol"
);

contract("ProposalManagement", accounts => {
    let firstVoter;
    let secondVoter;
    let nonMember;

    let proposalManagement;
    let contractFeeProposal;

    beforeEach(async () => {
        firstVoter = accounts[0];
        secondVoter = accounts[1];
        nonMember = accounts[9];
        proposalManagement = await ProposalManagement.new();
        await proposalManagement.createContractFeeProposal(4);
    });

    it("ProposalManagement gets deployed", async () => {
        assert.notStrictEqual(
            proposalManagement.address,
            0x0000000000000000000000000000000000000000,
            "proposalManagement deployed"
        );
        assert.strictEqual(
            parseInt(await proposalManagement.contractFee.call(), 10),
            parseInt(web3.utils.toWei("1", "finney"), 10),
            "contractFee should equal 1 finney"
        );
        assert.strictEqual(
            parseInt(await proposalManagement.getMembersLength.call(), 10),
            2,
            "expected two members to be added on creation"
        );
    });

    it("ContractFeeProposal gets created and address is saved", async () => {
        let proposals = await proposalManagement.getProposals.call();
        assert.strictEqual(proposals.length, 1, "should create 1 proposal");
        assert.notStrictEqual(
            proposals[0],
            0x0000000000000000000000000000000000000000,
            "should save a valid address to the contractFeeProposal"
        );
    });

    it("Access limitation is working", async () => {
        contractFeeProposal = (await proposalManagement.getProposals.call())[0];
        try {
            await proposalManagement.vote.call(true, contractFeeProposal, { from: nonMember });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "vote from nonMember should revert"
            )
        }
    })

    it("proposal gets executed after voting", async () => {
        contractFeeProposal = (await proposalManagement.getProposals.call())[0];
        let vote = await proposalManagement.vote(true, contractFeeProposal, { from: firstVoter });
        console.log(vote);
    })
});
