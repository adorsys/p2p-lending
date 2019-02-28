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
            vote.logs[1].args.executedProposal,
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
            vote.logs[1].args.executedProposal,
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
            vote.logs[1].args.executedProposal,
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

    it("positive vote for addMemberProposal has expected results", async () => {
        // get current number of members
        let oldMemberLength = parseInt(
            await proposalManagement.getMembersLength.call(),
            10
        );

        // positive vote for memberProposal to add member
        let proposal = (await proposalManagement.getProposals.call())[1];
        let vote = await proposalManagement.vote(true, proposal, {
            from: firstVoter
        });

        // expected events are triggered
        assert.strictEqual(
            vote.logs.length,
            3,
            "positive vote should trigger 2 events"
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
            vote.logs[1].args.executedProposal,
            proposal,
            "execute should log the correct proposal"
        );

        // MembershipChanged event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[2].event,
            "MembershipChanged",
            "should be MembershipChanged event"
        );
        assert.strictEqual(
            vote.logs[2].args.memberAddress,
            secondVoter,
            "should be the address of the secondVoter"
        );
        assert.strictEqual(
            vote.logs[2].args.memberStatus,
            true,
            "membership status of secondVoter should be true"
        );

        // member was not added to contract
        let newMemberLength = parseInt(
            await proposalManagement.getMembersLength.call(),
            10
        );
        assert.strictEqual(
            newMemberLength,
            oldMemberLength + 1,
            "secondVoter should have been added to members"
        );
    });

    it("negative vote for removeMemberProposal has expected results", async () => {
        // get current number of members
        let oldMemberLength = parseInt(
            await proposalManagement.getMembersLength.call(),
            10
        );

        // negative vote for memberProposal to remove member
        let proposal = (await proposalManagement.getProposals.call())[2];
        let vote = await proposalManagement.vote(false, proposal, {
            from: firstVoter
        });

        // expected events are triggered
        assert.strictEqual(
            vote.logs.length,
            2,
            "negative vote should only trigger 2 events"
        );

        // Voted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[0].event,
            "Voted",
            "should be Voted event"
        );
        assert.strictEqual(
            vote.logs[0].args.proposalAddress,
            proposal,
            "should be the address of remove MemberProposal"
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
            "should be ProposalExecuted event"
        );
        assert.strictEqual(
            vote.logs[1].args.executedProposal,
            proposal,
            "proposal should have been executed"
        );

        // firstVoter is still a member
        let newMemberLength = parseInt(
            await proposalManagement.getMembersLength.call(),
            10
        );
        assert.strictEqual(
            newMemberLength,
            oldMemberLength,
            "should still be two members"
        );

        let memberAddress = await proposalManagement.members.call(1);
        assert.strictEqual(
            memberAddress,
            firstVoter,
            "member should be firstVoter"
        );
    });

    it("positive vote for removeMemberProposal has expected results", async () => {
        // get current number of members
        let oldMemberLength = parseInt(
            await proposalManagement.getMembersLength.call(),
            10
        );

        // positive vote for memberProposal to remove member
        let proposal = (await proposalManagement.getProposals.call())[2];
        let vote = await proposalManagement.vote(true, proposal, {
            from: firstVoter
        });

        // expected events are triggered
        assert.strictEqual(
            vote.logs.length,
            3,
            "positive vote should trigger 3 events"
        );

        // Voted event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[0].event,
            "Voted",
            "should be Voted event"
        );
        assert.strictEqual(
            vote.logs[0].args.proposalAddress,
            proposal,
            "should be the address of remove MemberProposal"
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
            "should be ProposalExecuted event"
        );
        assert.strictEqual(
            vote.logs[1].args.executedProposal,
            proposal,
            "proposal should have been executed"
        );

        // MembershipChanged event gets triggered with expected parameters
        assert.strictEqual(
            vote.logs[2].event,
            "MembershipChanged",
            "should be MembershipChanged"
        );
        assert.strictEqual(
            vote.logs[2].args.memberAddress,
            firstVoter,
            "should be firstVoter"
        );
        assert.strictEqual(
            vote.logs[2].args.memberStatus,
            false,
            "new memberStatus of firstVoter should be false"
        );

        // firstVoter was removed from members
        let newMemberLength = parseInt(
            await proposalManagement.getMembersLength.call(),
            10
        );
        assert.strictEqual(
            newMemberLength,
            oldMemberLength - 1,
            "should now be 1 member"
        );

        // firstVoters authorization was revoked
        try {
            await proposalManagement.createContractFeeProposal(7, {
                from: firstVoter
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "unauthorized creation of proposal should revert"
            );
        }
    });

    it("minimumNumberOfVotes gets modified when members are added or removed", async () => {
        // minimumNumberOfVotes gets modified when (members.length / 2) > minimumNumberOfVotes

        // get old vote parameters
        let oldMinNumberOfVotes = parseInt(
            await proposalManagement.minimumNumberOfVotes.call(),
            10
        );

        // positive vote for memberProposal to add second
        let proposal = (await proposalManagement.getProposals.call())[1];
        await proposalManagement.vote(true, proposal, {
            from: firstVoter
        });

        // add third member
        await proposalManagement.createMemberProposal(thirdVoter, true, {
            from: firstVoter
        });
        proposal = (await proposalManagement.getProposals.call())[2];
        await proposalManagement.vote(true, proposal, { from: firstVoter });

        // check if minimumNumberOfVotes has changed
        let newMinNumberOfVotes = parseInt(
            await proposalManagement.minimumNumberOfVotes.call(),
            10
        );

        assert.strictEqual(
            newMinNumberOfVotes,
            oldMinNumberOfVotes + 1,
            "minimumNumberOfVotes should be increased to 2"
        );

        oldMinNumberOfVotes = newMinNumberOfVotes;

        // create remove memberProposal to trigger voting rules change again
        await proposalManagement.createMemberProposal(thirdVoter, false, {
            from: firstVoter
        });
        proposal = (await proposalManagement.getProposals.call())[2];

        // positive votes for memberProposal to remove thirdVoter
        // proposal needs two votes now to pass
        await proposalManagement.vote(true, proposal, { from: firstVoter });
        await proposalManagement.vote(true, proposal, { from: secondVoter });

        // check if minimumNumberOfVotes has changed again
        newMinNumberOfVotes = parseInt(
            await proposalManagement.minimumNumberOfVotes.call(),
            10
        );
        assert.strictEqual(
            newMinNumberOfVotes,
            oldMinNumberOfVotes - 1,
            "minimumNumberOfVotes should be reduced to 1 again"
        );
    });
});
