const ProposalManagement = artifacts.require("ProposalManagement");
const ProposalFactory = artifacts.require("ProposalFactory");
const TrustToken = artifacts.require("TrustToken");

contract("ProposalManagement", accounts => {
    let firstVoter;
    let nonMember;

    let proposalManagement;
    let trustToken;

    beforeEach(async () => {
        firstVoter = accounts[0];
        nonMember = accounts[9];
        trustToken = await TrustToken.new(1000, "TrustToken", 18, "TT");
        proposalManagement = await ProposalManagement.new(
            ProposalFactory.address,
            trustToken.address,
            { from: firstVoter }
        );
        const newFee = web3.utils.toWei("0.2", "ether");
        await proposalManagement.createContractFeeProposal(newFee, {
            from: firstVoter
        });
    });

    it("ProposalManagement gets deployed", async () => {
        // proposalManagement contract gets deployed
        assert.notStrictEqual(
            proposalManagement.address,
            0x0,
            "proposalManagement deployed"
        );

        // contractFee gets initialized correctly
        assert.strictEqual(
            parseInt(await proposalManagement.contractFee.call(), 10),
            parseInt(web3.utils.toWei("1", "ether"), 10),
            "contractFee should equal 1 ether"
        );

        // expected number of members get added to the contract
        assert.strictEqual(
            parseInt(await proposalManagement.getMembersLength.call(), 10),
            2,
            "expected two members to be added on creation"
        );

        // expected number of proposals get created when running tests
        assert.strictEqual(
            (await proposalManagement.getProposals.call()).length,
            1,
            "should create 1 proposal when tests are executed"
        );

        // first proposal is a contractFeeProposal
        let contractFeeProposal = (await proposalManagement.getProposals.call())[0];
        assert.strictEqual(
            parseInt(
                await proposalManagement.proposalType.call(contractFeeProposal),
                10
            ),
            1,
            "proposal should be a contractFeeProposal"
        );
    });

    it("Access limitation is working", async () => {
        // cannot create contractFeeProposal as nonMember
        try {
            await proposalManagement.createContractFeeProposal.call(2, {
                from: nonMember
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "proposal creation from nonMember should revert"
            );
        }
        // cannot vote for a proposal as a nonMember
        let contractFeeProposal = (await proposalManagement.getProposals.call())[0];
        try {
            await proposalManagement.vote.call(
                true,
                contractFeeProposal,
                nonMember,
                { from: nonMember }
            );
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "vote from nonMember should revert"
            );
        }
    });

    it("negative vote for contractFeeProposal has expected results", async () => {
        // negative vote for contractFeeProposal
        let proposal = (await proposalManagement.getProposals.call())[0];
        let vote = await proposalManagement.vote(false, proposal, firstVoter, {
            from: firstVoter
        });

        // negative vote triggers expected events
        assert.strictEqual(
            vote.logs.length,
            1,
            "negative vote should trigger 1 event"
        );

        // ProposalExecuted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[0].event,
            "ProposalExecuted",
            "second event should be ProposalExecuted"
        );
        assert.strictEqual(
            vote.logs[0].args.executedProposal,
            proposal,
            "execute should log the correct proposal"
        );

        // contractFee does NOT get changed
        let newFee = parseInt(await proposalManagement.contractFee.call());
        assert.strictEqual(
            newFee,
            parseInt(web3.utils.toWei("1", "ether"), 10),
            "fee should be set to 1 ETH"
        );
    });

    it("positive vote for contractFeeProposal has expected results", async () => {
        // positive vote for contractFeeProposal
        let proposal = (await proposalManagement.getProposals.call())[0];
        let vote = await proposalManagement.vote(true, proposal, firstVoter, {
            from: firstVoter
        });

        // positive vote triggers expected events
        assert.strictEqual(
            vote.logs.length,
            2,
            "positive vote should trigger 2 events"
        );

        // ProposalExecuted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[0].event,
            "ProposalExecuted",
            "second event should be ProposalExecuted"
        );
        assert.strictEqual(
            vote.logs[0].args.executedProposal,
            proposal,
            "execute should log the correct proposal"
        );

        // NewContractFee event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[1].event,
            "NewContractFee",
            "third event should be NewContractFee"
        );
        assert.strictEqual(
            parseInt(vote.logs[1].args.oldFee, 10),
            parseInt(web3.utils.toWei("1", "ether"), 10),
            "old Fee should be 1 ETH"
        );

        assert.strictEqual(
            parseInt(vote.logs[1].args.newFee, 10),
            parseInt(web3.utils.toWei("0.2", "ether"), 10),
            "new Fee should be 0.2 ETH"
        );

        // contract fee get changed to expected new fee
        let newFee = parseInt(await proposalManagement.contractFee.call());
        assert.strictEqual(
            newFee,
            parseInt(web3.utils.toWei("0.2", "ether"), 10),
            "fee should be set to 0.2 ETH"
        );
    });
});
