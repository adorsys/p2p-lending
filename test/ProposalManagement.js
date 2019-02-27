const ProposalManagement = artifacts.require("./ProposalManagement.sol");
const ProposalFactory = artifacts.require(
    "./ProposalFactory/ProposalFactory.sol"
);

contract("ProposalManagement", accounts => {
    let firstVoter;
    let secondVoter;
    let thirdVoter;
    let nonMember;

    let proposalManagement;

    beforeEach(async () => {
        firstVoter = accounts[0];
        secondVoter = accounts[1];
        thirdVoter = accounts[2];
        nonMember = accounts[9];
        proposalManagement = await ProposalManagement.new(
            ProposalFactory.address
        );
        await proposalManagement.createContractFeeProposal(2, {
            from: firstVoter
        });
        await proposalManagement.createMemberProposal(secondVoter, true, {
            from: firstVoter
        });
        await proposalManagement.createMemberProposal(firstVoter, false, {
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
            3,
            "should create 3 proposals when tests are executed"
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

        // second proposal is a memberProposal to add a member
        let addMemberProposal = (await proposalManagement.getProposals.call())[1];
        assert.strictEqual(
            parseInt(
                await proposalManagement.proposalType.call(addMemberProposal),
                10
            ),
            2,
            "proposal should be a memberProposal to add a member"
        );

        // third proposal is a memberProposal to remove a member
        let removeMemberProposal = (await proposalManagement.getProposals.call())[2];
        assert.strictEqual(
            parseInt(
                await proposalManagement.proposalType.call(
                    removeMemberProposal
                ),
                10
            ),
            3,
            "proposal should be a memberProposal to remove a member"
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

        // cannot create memberProposal as nonMember
        try {
            await proposalManagement.createMemberProposal.call(
                secondVoter,
                true,
                { from: nonMember }
            );
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "proposal creation from nonMember should revert"
            );
        }

        // cannot vote for a proposal as a nonMember
        let contractFeeProposal = (await proposalManagement.getProposals.call())[0];
        try {
            await proposalManagement.vote.call(true, contractFeeProposal, {
                from: nonMember
            });
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
        let vote = await proposalManagement.vote(false, proposal, {
            from: firstVoter
        });

        // negative vote triggers expected events
        assert.strictEqual(
            vote.logs.length,
            2,
            "negative vote should trigger 2 events"
        );

        // Voted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[0].event,
            "Voted",
            "first event should be Voted"
        );
        assert.strictEqual(
            vote.logs[0].args.proposalAddress,
            proposal,
            "should be a vote for the expected proposal"
        );
        assert.strictEqual(
            vote.logs[0].args.stance,
            false,
            "should be a negative vote"
        );
        assert.strictEqual(
            vote.logs[0].args.from,
            firstVoter,
            "should be a vote from firstVoter"
        );

        // ProposalExecuted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[1].event,
            "ProposalExecuted",
            "second event should be ProposalExecuted"
        );
        assert.strictEqual(
            vote.logs[1].args.ContractFeeProposal,
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
        let vote = await proposalManagement.vote(true, proposal, {
            from: firstVoter
        });

        // positive vote triggers expected events
        assert.strictEqual(
            vote.logs.length,
            3,
            "positive vote should trigger 3 events"
        );

        // Voted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[0].event,
            "Voted",
            "first event should be voted"
        );
        assert.strictEqual(
            vote.logs[0].args.proposalAddress,
            proposal,
            "should be a vote for the expected proposal"
        );
        assert.strictEqual(
            vote.logs[0].args.stance,
            true,
            "should be a positive vote"
        );
        assert.strictEqual(
            vote.logs[0].args.from,
            firstVoter,
            "should be a vote from firstVoter"
        );

        // ProposalExecuted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[1].event,
            "ProposalExecuted",
            "second event should be ProposalExecuted"
        );
        assert.strictEqual(
            vote.logs[1].args.ContractFeeProposal,
            proposal,
            "execute should log the correct proposal"
        );

        // NewContractFee event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[2].event,
            "NewContractFee",
            "third event should be NewContractFee"
        );
        assert.strictEqual(
            parseInt(vote.logs[2].args.oldFee, 10),
            parseInt(web3.utils.toWei("1", "ether"), 10),
            "old Fee should be 1 ETH"
        );

        assert.strictEqual(
            parseInt(vote.logs[2].args.newFee, 10),
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

    it("negative vote for addMemberProposal has expected results", async () => {
        // get current number of members
        let oldMemberLength = parseInt(
            await proposalManagement.getMembersLength.call(),
            10
        );

        // negative vote for memberProposal to add member
        let proposal = (await proposalManagement.getProposals.call())[1];
        let vote = await proposalManagement.vote(false, proposal, {
            from: firstVoter
        });

        // expected events are triggered
        assert.strictEqual(
            vote.logs.length,
            2,
            "negative vote should trigger 2 events"
        );

        // Voted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[0].event,
            "Voted",
            "first event should be Voted"
        );
        assert.strictEqual(
            vote.logs[0].args.proposalAddress,
            proposal,
            "should be a vote for the expected proposal"
        );
        assert.strictEqual(
            vote.logs[0].args.stance,
            false,
            "should be a negative vote"
        );
        assert.strictEqual(
            vote.logs[0].args.from,
            firstVoter,
            "should be a vote from firstVoter"
        );

        // ProposalExecuted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[1].event,
            "ProposalExecuted",
            "second event should be ProposalExecuted"
        );
        assert.strictEqual(
            vote.logs[1].args.ContractFeeProposal,
            proposal,
            "execute should log the correct proposal"
        );

        // member was not added to contract
        let newMemberLength = parseInt(
            await proposalManagement.getMembersLength.call(),
            10
        );
        assert.strictEqual(
            newMemberLength,
            oldMemberLength,
            "contract should still only consist of two members"
        );
    });
});
