const LendingBoard = artifacts.require("./LendingBoard.sol");
const Web3 = require("web3");
const web3 = new Web3("ws://127.0.0.1:8545");

// add functionality to change the local time to test functions
// that can only be called after a certain amount of time has passed
// 1 hour is equal to 3600 | 1 day is equal to 86400 seconds

const timeTravel = function(time) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send(
            {
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [time],
                id: new Date().getTime()
            },
            (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            }
        );
    });
};

contract("LendingBoard", function(accounts) {
    const admin = accounts[0];
    const newUser = accounts[1];
    const nonMember = accounts[9];
    let LendingBoardInstance;
    let expectedProposals = 0;

    it("initializes the lending board correctly", async function() {
        // check if contract was deployed

        LendingBoardInstance = await LendingBoard.deployed();
        assert.notStrictEqual(LendingBoardInstance.address, 0x0, "has board address");

        // check if contract fee was initialized

        let fee = await LendingBoardInstance.contractFee.call();
        assert.strictEqual(fee.toNumber(), 1000, "sets contract fee correctly");

        // check if minimum quorum was initialized

        let minimumQuorum = await LendingBoardInstance.minQuorum.call();
        assert.strictEqual(minimumQuorum.toNumber(), 1, "sets minimum quorum correctly");

        // check if debating period was initialized

        let debatingPeriod = await LendingBoardInstance.debateTime.call();
        assert.strictEqual(debatingPeriod.toNumber(), 30, "sets debating time correctly");

        // check if majority margin was initialized

        let majorityMargin = await LendingBoardInstance.majorityMargin.call();
        assert.strictEqual(majorityMargin.toNumber(), 50, "sets majority margin correctly");

        // check if a member was added on creation

        let numMembers = await LendingBoardInstance.getMembersLength.call();
        assert.strictEqual(numMembers.toNumber(), 1, "adds one member");

        // check if first member is the creator of the contract

        let firstMember = await LendingBoardInstance.members.call(numMembers - 1);
        assert.strictEqual(firstMember[1], "owner", "adds owner as first member");
        assert.strictEqual(firstMember[0], admin, "adds owner as first member");
    });

    it("can create Fee Proposal", async function() {
        // try to create a proposal without being a member of the board

        try {
            await LendingBoardInstance.createFeeProposal.call(200, {
                from: nonMember
            });
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }

        // try to create a proposal with too low a fee

        try {
            await LendingBoardInstance.createFeeProposal.call(1, {
                from: admin
            });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "fee has to be higher than 100");
        }

        // get return value of createFeeProposal function call (does NOT change contract state)

        let pID = await LendingBoardInstance.createFeeProposal.call(500, { from: admin });

        // create feeProposal and change contract state

        let feeProposal = await LendingBoardInstance.createFeeProposal(500, { from: admin });
        expectedProposals++;

        // check if EVENT ProposalAdded was triggered

        assert.strictEqual(feeProposal.logs.length, 1, "triggers one event");
        assert.strictEqual(
            feeProposal.logs[0].event,
            "ProposalAdded",
            "should be ProposalAdded Event"
        );
        assert.strictEqual(
            feeProposal.logs[0].args._proposalID.toNumber(),
            pID.toNumber(),
            "should be the same as pID"
        );
        assert.strictEqual(
            feeProposal.logs[0].args._description,
            "Change Contract Fee",
            "should be Change Contract Fee"
        );

        // check if a proposal was created

        let actualProposals = await LendingBoardInstance.getProposalsLength.call();

        assert.strictEqual(
            actualProposals.toNumber(),
            expectedProposals,
            "actualProposals and expectedProposals should be equal"
        );

        // check if proposal was created with the user inputs
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

        // check if proposal was added to openProposals

        let actualOpenProposals = await LendingBoardInstance.getOpenProposalsLength.call();

        assert.strictEqual(
            actualOpenProposals.toNumber(),
            expectedProposals,
            "actualOpenProposals should be equal to expectedProposals"
        );
    });

    it("can create a MembershipProposal to add a member", async function() {
        // try to create a MembershipProposal without being a member of the board

        try {
            await LendingBoardInstance.createMembershipProposal.call(1, newUser, "newUser", {
                from: nonMember
            });
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }

        // try to use owner address as a parameter

        try {
            await LendingBoardInstance.createMembershipProposal.call(1, admin, "admin", {
                from: admin
            });
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "cannot use owner of the contract as a parameter"
            );
        }

        // get return value of createMembershipProposal (does NOT change contract state)

        let pID = await LendingBoardInstance.createMembershipProposal.call(1, newUser, "newUser", {
            from: admin
        });

        // create MembershipProposal to add Member (changes contract state)

        let membershipProposal = await LendingBoardInstance.createMembershipProposal(
            1,
            newUser,
            "newUser",
            { from: admin }
        );
        expectedProposals++;

        // check if EVENT ProposalAdded was triggered for add member
        assert.strictEqual(membershipProposal.logs.length, 1, "should have triggered 1 event");
        assert.strictEqual(
            membershipProposal.logs[0].event,
            "ProposalAdded",
            "should be ProposalAdded"
        );
        assert.strictEqual(
            membershipProposal.logs[0].args._proposalID.toNumber(),
            pID.toNumber(),
            "should be equal to pID"
        );
        assert.strictEqual(
            membershipProposal.logs[0].args._description,
            "Add Member",
            "should be Add Member"
        );

        // check if a proposal was created

        let actualProposals = await LendingBoardInstance.getProposalsLength.call();
        assert.strictEqual(
            actualProposals.toNumber(),
            expectedProposals,
            "actualProposals should be equal to expectedProposals"
        );

        // check if proposal was added with the user inputs

        let proposal = await LendingBoardInstance.proposals.call(actualProposals.toNumber() - 1);

        assert.strictEqual(proposal.fnNumber.toNumber(), 1, "should be 1 (add Member)");
        assert.strictEqual(proposal.memberAddress, newUser, "should be newUser");
        assert.strictEqual(proposal.memberName, "newUser", 'should be "newUser"');

        // check if proposal was added to openProposals

        let actualOpenProposals = await LendingBoardInstance.getOpenProposalsLength.call();
        assert.strictEqual(
            actualOpenProposals.toNumber(),
            expectedProposals,
            "actualOpenProposals should be equal to expectedProposals"
        );
    });

    it("can vote for an open Proposal", async function() {
        // can get the proposalID via openProposals

        let pID = await LendingBoardInstance.openProposals.call(0);

        // cannot vote for a proposal without being a member

        try {
            let dummyVote = await LendingBoardInstance.vote.call(pID.toNumber(), true, {
                from: nonMember
            });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "you are not a member of the board");
        }

        // get return value of vote function call (does NOT change the contract state)

        let voteID = await LendingBoardInstance.vote.call(pID.toNumber(), true, { from: admin });

        // vote for the proposal

        let actualVote = await LendingBoardInstance.vote(pID.toNumber(), true, { from: admin });

        // check if EVENT Voted was triggered

        assert.strictEqual(actualVote.logs.length, 1, "should trigger 1 event");
        assert.strictEqual(actualVote.logs[0].event, "Voted", "should be Voted");
        assert.strictEqual(
            actualVote.logs[0].args._proposalID.toNumber(),
            pID.toNumber(),
            "should be equal to pID"
        );
        assert.strictEqual(actualVote.logs[0].args._stance, true, "should be true");
        assert.strictEqual(actualVote.logs[0].args._voter, admin, "should be admin");

        // vote count gets increased after voting

        let proposal = await LendingBoardInstance.proposals.call(pID.toNumber());
        assert.strictEqual(proposal.numberOfVotes.toNumber(), 1, "should be one vote in total");
        assert.strictEqual(proposal.positiveVotes.toNumber(), 1, "should be one positve vote");

        // cannot vote for a proposal twice
        try {
            let doubleVote = await LendingBoardInstance.vote.call(pID.toNumber(), false, {
                from: admin
            });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "you can only vote once");
        }
    });

    it("can execute a proposal to change the contract fee", async function() {
        // first proposal has not been executed yet but has been voted for

        let pID = 0;
        let oldOpenProposals = await LendingBoardInstance.getOpenProposalsLength.call();

        // try to execute a proposal without being a member
        try {
            await LendingBoardInstance.executeProposal.call(pID, {
                from: nonMember
            });
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "you need to be a member of the board to call this function"
            );
        }

        // try to execute a proposal that has not passed the voting deadline yet

        try {
            await LendingBoardInstance.executeProposal.call(pID, { from: admin });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "debating time has not passed yet");
        }

        // advance time by 1 hour

        await timeTravel(3600);

        // try to execute a proposal that has not yet reached the minimum amount of votes

        try {
            await LendingBoardInstance.executeProposal.call(pID + 1, {
                from: admin
            });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "not enough votes for proposal");
        }

        // execute the proposal (changes state of the contract)

        let actualExecute = await LendingBoardInstance.executeProposal(pID, { from: admin });

        // check if EVENTS were triggered

        assert.strictEqual(actualExecute.logs.length, 2, "should trigger 2 events");

        // triggers ContractFeeChanged Event

        assert.strictEqual(
            actualExecute.logs[0].event,
            "ContractFeeChanged",
            "should be ContractFeeChanged"
        );
        assert.strictEqual(
            actualExecute.logs[0].args._oldFee.toNumber(),
            1000,
            "old fee should be 1000"
        );
        assert.strictEqual(
            actualExecute.logs[0].args._newFee.toNumber(),
            500,
            "new Fee should be 500"
        );

        // triggers ProposalExecuted Event

        assert.strictEqual(
            actualExecute.logs[1].event,
            "ProposalExecuted",
            "should be ProposalExecuted"
        );
        assert.strictEqual(
            actualExecute.logs[1].args._proposalID.toNumber(),
            pID,
            "should be equal to pID"
        );
        assert.strictEqual(
            actualExecute.logs[1].args._positiveVotes.toNumber(),
            1,
            "should have one positive vote"
        );
        assert.strictEqual(
            actualExecute.logs[1].args._numVotes.toNumber(),
            1,
            "should have one vote total"
        );
        assert.strictEqual(actualExecute.logs[1].args._executed, true, "should have been executed");

        // check if flags in the proposal were set

        let proposal = await LendingBoardInstance.proposals.call(0, { from: admin });
        assert.strictEqual(proposal.executed, true, "should have been executed");
        assert.strictEqual(proposal.proposalPassed, true, "proposal should have passed");

        // check if contract fee was updated

        let actualFee = await LendingBoardInstance.contractFee.call();
        let expectedFee = proposal.proposedFee.toNumber();

        assert.strictEqual(
            actualFee.toNumber(),
            expectedFee,
            "actualFee and proposedFee should be equal"
        );
        // try to execute the same proposal again
        try {
            await LendingBoardInstance.executeProposal.call(pID);
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "proposals cannot be executed twice");
        }

        // check if proposal was removed from the openProposals
        let actualOpenProposals = await LendingBoardInstance.getOpenProposalsLength.call();

        assert.strictEqual(
            actualOpenProposals.toNumber(),
            oldOpenProposals.toNumber() - 1,
            "should be 1 less than oldOpenProposals"
        );
    });

    it("can execute a proposal to add a member to the board", async function() {
        // add member proposal has id 1 in test

        let pID = 1;

        // vote for add member proposal

        await LendingBoardInstance.vote(pID, true, { from: admin });

        // execute proposal

        let actualExecute = await LendingBoardInstance.executeProposal(pID, { from: admin });

        // check if EVENTS were triggered

        assert.strictEqual(actualExecute.logs.length, 2, "should have triggered two events");

        // check if MembershipChanged Event was triggered

        assert.strictEqual(
            actualExecute.logs[0].event,
            "MembershipChanged",
            "should be MembershipChanged Event"
        );
        assert.strictEqual(actualExecute.logs[0].args._member, newUser, "should be newUser");
        assert.strictEqual(actualExecute.logs[0].args._isMember, true, "should be true");

        // check if ProposalExecuted Event was triggered

        assert.strictEqual(
            actualExecute.logs[1].event,
            "ProposalExecuted",
            "should be ProposalExecuted"
        );

        // check if member was added to the member list

        let nMbr = await LendingBoardInstance.members.call(1);
        assert.strictEqual(nMbr.member, newUser, "should be newUser");
        assert.strictEqual(nMbr.name, "newUser", "should be newUser");
    });

    it("can create a MembershipProposal to remove a member as a member", async function() {
        // try to remove a member that does not exist
        try {
            await LendingBoardInstance.createMembershipProposal.call(2, nonMember, "nonMember");
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "cannot create a proposal to remove a member that does not exist"
            );
        }

        // get return value of createMembershipProposal (does NOT change contract state)

        let pID = await LendingBoardInstance.createMembershipProposal.call(2, newUser, "newUser", {
            from: admin
        });

        // create MembershipProposal to remove a member (changes contract state)

        let removeMemberProposal = await LendingBoardInstance.createMembershipProposal(
            2,
            newUser,
            "newUser",
            { from: newUser }
        );

        expectedProposals++;
        // check if EVENT ProposalAdded was triggered
        assert.strictEqual(removeMemberProposal.logs.length, 1, "should trigger 1 event");
        assert.strictEqual(
            removeMemberProposal.logs[0].event,
            "ProposalAdded",
            "should be ProposalAdded"
        );
        assert.strictEqual(
            removeMemberProposal.logs[0].args._description,
            "Remove Member",
            "should be Remove Member"
        );
    });

    it("can execute a failed proposal without changes happening", async function() {
        let oldNumOpenProposals = await LendingBoardInstance.getOpenProposalsLength.call();

        // vote against proposal

        await LendingBoardInstance.vote(2, false);

        // execute the proposal

        await timeTravel(3600);
        let proposal = await LendingBoardInstance.executeProposal(2, { from: admin });

        // check if only ProposalExecuted event was triggered

        assert.strictEqual(proposal.logs.length, 1, "only 1 event should have been triggered");
        assert.strictEqual(
            proposal.logs[0].event,
            "ProposalExecuted",
            "should be the ProposalExecuted event"
        );

        // check if member newUser is still a member of the board

        let mbr = await LendingBoardInstance.members.call(1);
        assert.strictEqual(mbr.member, newUser, "should be newUser");
        assert.strictEqual(mbr.name, "newUser", "should be newUser");

        // failed proposal has the right flags

        let failedProposal = await LendingBoardInstance.proposals.call(2);
        assert.strictEqual(failedProposal.proposalPassed, false, "should not have passed");
        assert.strictEqual(failedProposal.executed, true, "should have been executed");

        // failed proposal was removed from openProposals
        let newNumOpenProposals = await LendingBoardInstance.getOpenProposalsLength.call();
        assert.strictEqual(
            newNumOpenProposals.toNumber(),
            oldNumOpenProposals.toNumber() - 1,
            "should be 1 proposal less than before"
        );
    });
});
