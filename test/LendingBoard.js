const LendingBoard = artifacts.require("./LendingBoard.sol");

contract("LendingBoard", accounts => {
    before(async () => {
        admin = accounts[0];
        newUser = accounts[1];
        nonMember = accounts[9];
        LendingBoardInstance = await LendingBoard.deployed();
    });

    let expectedProposals = 0;

    it("initializes the lending board", async () => {
        assert.notStrictEqual(
            LendingBoardInstance.address,
            0x0,
            "has board address"
        );

        let fee = await LendingBoardInstance.contractFee.call();
        assert.strictEqual(fee.toNumber(), 1000, "sets contract fee correctly");

        let minimumQuorum = await LendingBoardInstance.minQuorum.call();
        assert.strictEqual(
            minimumQuorum.toNumber(),
            1,
            "sets minimum quorum correctly"
        );

        let majorityMargin = await LendingBoardInstance.majorityMargin.call();
        assert.strictEqual(
            majorityMargin.toNumber(),
            50,
            "sets majority margin correctly"
        );

        let numMembers = await LendingBoardInstance.getMembersLength.call();
        assert.strictEqual(
            numMembers.toNumber(),
            2,
            "adds dummy and creator as members"
        );

        let firstMember = await LendingBoardInstance.members.call(
            numMembers - 1
        );
        assert.strictEqual(
            firstMember[1],
            "Creator",
            "adds owner as first member"
        );
        assert.strictEqual(firstMember[0], admin, "adds owner as first member");
    });

    it("create Fee Proposal", async () => {
        try {
            await LendingBoardInstance.createFeeProposal.call(200, {
                from: nonMember
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }

        try {
            await LendingBoardInstance.createFeeProposal.call(1, {
                from: admin
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "fee has to be higher than 100"
            );
        }

        // get return value of createFeeProposal function call (does NOT change contract state)

        let pID = await LendingBoardInstance.createFeeProposal.call(500, {
            from: admin
        });

        // create feeProposal and change contract state

        let feeProposal = await LendingBoardInstance.createFeeProposal(500, {
            from: admin
        });
        expectedProposals++;

        assert.strictEqual(feeProposal.logs.length, 1, "triggers one event");
        assert.strictEqual(
            feeProposal.logs[0].event,
            "ProposalAdded",
            "should be ProposalAdded Event"
        );
        assert.strictEqual(
            feeProposal.logs[0].args.proposalID.toNumber(),
            pID.toNumber(),
            "id emitted by event should be the same as pID"
        );
        assert.strictEqual(
            feeProposal.logs[0].args.description,
            "Change Contract Fee",
            "should be Change Contract Fee"
        );

        let actualProposals = await LendingBoardInstance.getProposalsLength.call();
        assert.strictEqual(
            actualProposals.toNumber(),
            expectedProposals,
            "proposal should have been added to proposals"
        );

        let createdProposal = await LendingBoardInstance.proposals.call(
            actualProposals.toNumber() - 1
        );
        assert.strictEqual(
            createdProposal.author,
            admin,
            "should have been created by the owner of the contract"
        );
        assert.strictEqual(
            createdProposal.proposedFee.toNumber(),
            500,
            "proposed fee should be 500"
        );

        let actualOpenProposals = await LendingBoardInstance.getOpenProposalsLength.call();

        assert.strictEqual(
            actualOpenProposals.toNumber(),
            expectedProposals,
            "proposal should have been added to openProposals"
        );
    });

    it("create a propsal to add a member", async function() {
        try {
            await LendingBoardInstance.createMembershipProposal.call(
                1,
                newUser,
                "newUser",
                {
                    from: nonMember
                }
            );
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }
        try {
            await LendingBoardInstance.createMembershipProposal.call(
                1,
                admin,
                "admin",
                {
                    from: admin
                }
            );
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "cannot use owner of the contract as a parameter"
            );
        }

        // get return value of createMembershipProposal (does NOT change contract state)

        let pID = await LendingBoardInstance.createMembershipProposal.call(
            1,
            newUser,
            "newUser",
            {
                from: admin
            }
        );

        // create MembershipProposal to add Member (changes contract state)

        let membershipProposal = await LendingBoardInstance.createMembershipProposal(
            1,
            newUser,
            "newUser",
            { from: admin }
        );
        expectedProposals++;

        assert.strictEqual(
            membershipProposal.logs.length,
            1,
            "should have triggered 1 event"
        );
        assert.strictEqual(
            membershipProposal.logs[0].event,
            "ProposalAdded",
            "should be ProposalAdded"
        );
        assert.strictEqual(
            membershipProposal.logs[0].args.proposalID.toNumber(),
            pID.toNumber(),
            "id emitted by event should be equal to pID"
        );
        assert.strictEqual(
            membershipProposal.logs[0].args.description,
            "Add Member",
            "should be Add Member"
        );

        let actualProposals = await LendingBoardInstance.getProposalsLength.call();
        assert.strictEqual(
            actualProposals.toNumber(),
            expectedProposals,
            "proposal should have been added to proposals"
        );

        let proposal = await LendingBoardInstance.proposals.call(
            actualProposals.toNumber() - 1
        );
        assert.strictEqual(
            proposal.fnNumber.toNumber(),
            1,
            "should be 1 (add Member)"
        );
        assert.strictEqual(
            proposal.memberAddress,
            newUser,
            "should be newUser"
        );
        assert.strictEqual(
            proposal.memberName,
            "newUser",
            'should be "newUser"'
        );

        let actualOpenProposals = await LendingBoardInstance.getOpenProposalsLength.call();
        assert.strictEqual(
            actualOpenProposals.toNumber(),
            expectedProposals,
            "proposal should have been added to openProposals"
        );
    });

    it("vote and execute an open contract fee proposal", async () => {
        try {
            await LendingBoardInstance.vote.call(0, true, {
                from: nonMember
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "you are not a member of the board"
            );
        }

        let actualVote = await LendingBoardInstance.vote(0, true, {
            from: admin
        });

        assert.strictEqual(
            actualVote.logs.length,
            3,
            "should trigger 3 events"
        );
        assert.strictEqual(
            actualVote.logs[0].event,
            "Voted",
            "should be Voted"
        );
        assert.strictEqual(
            actualVote.logs[1].event,
            "ContractFeeChanged",
            "should be ContractFeeChanged"
        );
        assert.strictEqual(
            actualVote.logs[2].event,
            "ProposalExecuted",
            "should be ProposalExecuted"
        );

        let proposal = await LendingBoardInstance.proposals.call(0);
        assert.strictEqual(
            proposal.numberOfVotes.toNumber(),
            1,
            "should be one vote in total"
        );
        assert.strictEqual(
            proposal.positiveVotes.toNumber(),
            1,
            "should be one positve vote"
        );
        assert.strictEqual(
            proposal.executed,
            true,
            "proposal should have been executed"
        );

        let contractFee = await LendingBoardInstance.contractFee.call();
        assert.strictEqual(
            contractFee.toNumber(),
            500,
            "contract fee should be 0.5 ETH"
        );

        try {
            await LendingBoardInstance.vote.call(0, false, {
                from: admin
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "you can only vote once"
            );
        }
    });

    it("vote and execute a proposal to add a member", async () => {
        let actualVote = await LendingBoardInstance.vote(0, true, {
            from: admin
        });

        assert.strictEqual(
            actualVote.logs.length,
            3,
            "should trigger 3 events"
        );
        assert.strictEqual(
            actualVote.logs[0].event,
            "Voted",
            "should be Voted"
        );
        assert.strictEqual(
            actualVote.logs[1].event,
            "MembershipChanged",
            "should be MembershipChanged"
        );
        assert.strictEqual(
            actualVote.logs[1].args.member,
            newUser,
            "should be newUser"
        );
        assert.strictEqual(
            actualVote.logs[1].args.isMember,
            true,
            "newUser should be a member now"
        );
        assert.strictEqual(
            actualVote.logs[2].event,
            "ProposalExecuted",
            "should be ProposalExecuted"
        );

        let proposal = await LendingBoardInstance.proposals.call(0);
        assert.strictEqual(
            proposal.numberOfVotes.toNumber(),
            1,
            "should be one vote in total"
        );
        assert.strictEqual(
            proposal.positiveVotes.toNumber(),
            1,
            "should be one positve vote"
        );
        assert.strictEqual(
            proposal.executed,
            true,
            "proposal should have been executed"
        );

        let mId = (await LendingBoardInstance.memberID.call(
            newUser
        )).toNumber();

        assert.notStrictEqual(mId, 0, "memberID should not be 0");

        let memberNewUser = await LendingBoardInstance.members.call(mId);
        assert.strictEqual(
            memberNewUser.member,
            newUser,
            "should be address of newUser"
        );
        assert.strictEqual(memberNewUser.name, "newUser", "should be newUser");
    });

    it("create, vote and execute a proposal to remove a member", async () => {
        await LendingBoardInstance.createMembershipProposal(
            2,
            newUser,
            "newUser",
            {
                from: admin
            }
        );
        let actualVote = await LendingBoardInstance.vote(0, true, {
            from: admin
        });

        assert.strictEqual(
            actualVote.logs[1].args.member,
            newUser,
            "should be newUser"
        );
        assert.strictEqual(
            actualVote.logs[1].args.isMember,
            false,
            "newUser should not be a member anymore"
        );

        let mId = (await LendingBoardInstance.memberID.call(
            newUser
        )).toNumber();

        assert.strictEqual(mId, 0, "memberID should be 0");

        let membersLength = (await LendingBoardInstance.getMembersLength.call()).toNumber();
        assert.strictEqual(membersLength, 2, "should only contain two members");
    });

    it("create, vote and execute a failed proposal", async () => {
        await LendingBoardInstance.createMembershipProposal(
            1,
            newUser,
            "newUser",
            {
                from: admin
            }
        );

        let proposalID = (await LendingBoardInstance.openProposals.call(
            0
        )).toNumber();

        await LendingBoardInstance.vote(0, false, {
            from: admin
        });

        let ProposalExecuted = (await LendingBoardInstance.proposals.call(
            proposalID
        )).executed;

        assert.strictEqual(
            ProposalExecuted,
            true,
            "proposal should have been executed"
        );

        let mId = (await LendingBoardInstance.memberID.call(
            newUser
        )).toNumber();

        assert.strictEqual(mId, 0, "memberID should be 0");

        let membersLength = (await LendingBoardInstance.getMembersLength.call()).toNumber();
        assert.strictEqual(membersLength, 2, "should not contain newUser");
    });

    it("can only create 25 open proposals", async function() {
        for (let i = 0; i < 25; i++) {
            await LendingBoardInstance.createFeeProposal(500, {
                from: admin
            });
        }

        try {
            await LendingBoardInstance.createFeeProposal.call(200, {
                from: admin
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "only 25 open proposals allowed - cannot create open proposal 26"
            );
        }
    });
});
