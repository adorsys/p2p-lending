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
    let proposalID;
    let currentOpenProps;
    let currentProposals;
    let propVotes;
    let propPosVotes;
    const proposedFee = 200;
    let numMembers;

    it("initializes the lending board correctly", async function() {
        LendingBoardInstance = await LendingBoard.deployed();
        assert.notStrictEqual(LendingBoardInstance.address, 0x0, "has board address");

        numMembers = await LendingBoardInstance.getMembersLength.call();
        numMembers = numMembers.toNumber();

        let fee = await LendingBoardInstance.contractFee.call();
        assert.strictEqual(fee.toNumber(), 1000, "sets contract fee correctly");

        let minimumQuorum = await LendingBoardInstance.minimumQuorum.call();
        assert.strictEqual(minimumQuorum.toNumber(), 1, "sets minimum quorum correctly");

        let debatingPeriod = await LendingBoardInstance.debatingPeriodInMinutes.call();
        assert.strictEqual(debatingPeriod.toNumber(), 30, "sets debating period correctly");

        let majorityMargin = await LendingBoardInstance.majorityMargin.call();
        assert.strictEqual(majorityMargin.toNumber(), 50, "sets majority margin correctly");

        let firstMember = await LendingBoardInstance.members.call(numMembers - 1);
        assert.strictEqual(firstMember[1], "owner", "adds owner as first member");
        assert.strictEqual(firstMember[0], admin, "adds owner as first member");
    });

    it("can create a proposal to change the contract fee", async function() {
        // try to create a proposal without being a member of the board
        try {
            let nonMemberProposal = await LendingBoardInstance.newFeeProposal(200, {
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
            let wrongFeeProposal = await LendingBoardInstance.newFeeProposal(50, { from: admin });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "fee must be higher than 100");
        }

        // get return value of newFeeProposal (does not change the state of the contract)
        // used in EVENT test
        let pID = await LendingBoardInstance.newFeeProposal.call(proposedFee);
        // actually create a newFeeProposal (changes state of the contract)
        let proposal = await LendingBoardInstance.newFeeProposal(proposedFee);

        // check if Event Proposal Added was emitted
        assert.strictEqual(proposal.logs.length, 1, "triggers one event");
        assert.strictEqual(
            proposal.logs[0].event,
            "ProposalAdded",
            "should be the ProposalAdded event"
        );

        assert.strictEqual(
            proposal.logs[0].args.ProposalID.toNumber(),
            pID.toNumber(),
            "should be pID"
        );

        assert.strictEqual(
            proposal.logs[0].args.description,
            "Change Contract Fee",
            "should be Change Contract Fee"
        );

        let numProps = await LendingBoardInstance.numProposals.call();
        assert.strictEqual(numProps.toNumber(), 1, "only one proposal should have been added");

        // check if proposal was added to openProposals
        currentOpenProps = await LendingBoardInstance.getOcLength.call();
        currentOpenProps = currentOpenProps.toNumber();
        assert.strictEqual(currentOpenProps, 1, "should only be one open proposal");

        // check if proposal was added to proposals
        currentProposals = await LendingBoardInstance.getPropLength.call();
        currentProposals = currentProposals.toNumber();
        assert.strictEqual(currentProposals, 1, "should only be one proposal");
    });

    it("can create a proposal to add another member to the board", async function() {
        // try to create the proposal without being a member
        try {
            let failAddMember = await LendingBoardInstance.newMemberProposal(
                newUser,
                "newUser",
                "1",
                {
                    from: nonMember
                }
            );
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }

        // try to create the proposal with an invalid address
        try {
            let invalAddMember = await LendingBoardInstance.newMemberProposal(
                "0x0000000000000000000000000000000000000000",
                "invalid address",
                "1",
                { from: admin }
            );
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "provide a vaild address to add to the board"
            );
        }

        // get return value of proposal call for EVENT test
        let pID = await LendingBoardInstance.newMemberProposal.call(newUser, "newUser", "1", {
            from: admin
        });

        // actually add the proposal to the contract state
        let memberProposal = await LendingBoardInstance.newMemberProposal(newUser, "newUser", "1", {
            from: admin
        });

        // check if EVENT ProposalAdded was triggered
        assert.strictEqual(memberProposal.logs.length, 1, "triggers one event");
        assert.strictEqual(
            memberProposal.logs[0].event,
            "ProposalAdded",
            "should be the ProposalAdded event"
        );

        assert.strictEqual(
            memberProposal.logs[0].args.ProposalID.toNumber(),
            pID.toNumber(),
            "should be pID"
        );

        assert.strictEqual(
            memberProposal.logs[0].args.description,
            "Add Member",
            "should be Add Member"
        );

        // check if number of Proposals was incremented
        let numProps = await LendingBoardInstance.numProposals.call();
        assert.strictEqual(numProps.toNumber(), 2, "should be the second proposal");

        // check if proposal was added to Proposals
        let oldNumProps = currentProposals;
        currentProposals = await LendingBoardInstance.getPropLength.call();
        currentProposals = currentProposals.toNumber();
        assert.strictEqual(
            currentProposals,
            oldNumProps + 1,
            "should only be one proposal more than before"
        );

        // check if proposal was added to openProposals
        currentOpenProps = await LendingBoardInstance.getOcLength.call();
        currentOpenProps = currentOpenProps.toNumber();
        assert.strictEqual(currentOpenProps, 2, "should be two open proposals");
    });

    it("can get and check the created proposal", async function() {
        proposalID = await LendingBoardInstance.openProposals.call(0);
        let prop = await LendingBoardInstance.Proposals.call(proposalID.toNumber());
        propVotes = prop.numberOfVotes.toNumber();
        propPosVotes = prop.positiveVotes.toNumber();
        assert.strictEqual(prop[0], admin, "should come from the admin");
        assert.strictEqual(prop.proposedFee.toNumber(), 200, "proposed fee should be 200");
    });

    it("can vote for a proposal", async function() {
        // try to vote for a proposal without being a member of the board
        try {
            let vote = await LendingBoardInstance.vote(proposalID, true, {
                from: nonMember
            });
        } catch (err) {
            // console.log(err);
            assert(
                err.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }

        // check if vote count gets returned when voting
        // without changing the state of the contract
        let dummyVote = await LendingBoardInstance.vote.call(proposalID, true, {
            from: admin
        });
        assert.strictEqual(dummyVote.toNumber(), propVotes + 1, "should be 1 more than prop");

        // vote and change state of contract
        let vote = await LendingBoardInstance.vote(proposalID, true, {
            from: admin
        });
        // increase internal vote count
        propVotes++;
        propPosVotes++;

        // check for vote event
        assert.strictEqual(vote.logs.length, 1, "triggers one event");
        assert.strictEqual(vote.logs[0].event, "Voted", "should be the Voted event");
        assert.strictEqual(
            vote.logs[0].args.ProposalID.toNumber(),
            proposalID.toNumber(),
            "wrong proposalID"
        );
        assert.strictEqual(vote.logs[0].args.stanceOnProposal, true, "should be true");
        assert.strictEqual(vote.logs[0].args.voter, admin, "should be admin");

        // check if proposal was modified correctly
        let proposal = await LendingBoardInstance.Proposals.call(proposalID);

        // check if internal proposal vote counts were modified correctly
        assert.strictEqual(
            proposal.numberOfVotes.toNumber(),
            propVotes,
            "should be equal to prop Votes"
        );
        assert.strictEqual(
            proposal.positiveVotes.toNumber(),
            propPosVotes,
            "should be equal to propPosVotes"
        );

        // check if vote was registered for msg.sender by trying to vote again
        try {
            let secondVote = await LendingBoardInstance.vote(proposalID, true, {
                from: admin
            });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "you can only vote once");
        }
    });

    it("can execute the change Fee proposal", async function() {
        // try to execute the proposal without being a member of the board
        try {
            let dummyExecute = await LendingBoardInstance.executeProposal.call(proposalID, {
                from: nonMember
            });
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }

        // try to execute the proposal before the debate time has passed

        try {
            let premExecute = await LendingBoardInstance.executeProposal(proposalID);
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "can only be executed after the voting deadline"
            );
        }

        // travel 1 hour into the future
        await timeTravel(3600);
        let actualExecute = await LendingBoardInstance.executeProposal(proposalID);

        // check if EVENT ProposalTallied was triggered
        assert.strictEqual(actualExecute.logs.length, 1, "triggers one event");
        assert.strictEqual(
            actualExecute.logs[0].event,
            "ProposalTallied",
            "should be the ProposalTallied event"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.proposalID.toNumber(),
            proposalID.toNumber(),
            "wrong proposalID"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.result.toNumber(),
            propPosVotes,
            "should be the same as internal positive vote counter"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.quorum.toNumber(),
            propVotes,
            "should be the same as internal vote counter"
        );
        assert.strictEqual(actualExecute.logs[0].args.active, true, "proposal should have passed");

        // check if contract fee was updated
        let actualFee = await LendingBoardInstance.contractFee.call();
        assert.strictEqual(actualFee.toNumber(), proposedFee, "should be 200");

        // check if proposal had the expected tag changes
        let executedProposal = await LendingBoardInstance.Proposals.call(proposalID);

        assert.strictEqual(executedProposal.executed, true, "should be executed and true");
        assert.strictEqual(executedProposal.proposalPassed, true, "should have passed and true");

        // check if entry in openProposals was removed
        let newLeng = await LendingBoardInstance.getOcLength.call();
        assert.strictEqual(newLeng.toNumber(), currentProposals - 1, "should have been removed");
    });

    it("can execute the add Member proposal", async function() {
        // get ID of proposal to execute
        proposalID = await LendingBoardInstance.openProposals.call(0);

        // update number of currentOpenProps
        currentOpenProps = await LendingBoardInstance.getOcLength.call();

        // try executing the proposal without voting first
        try {
            let dummyExecute = await LendingBoardInstance.executeProposal.call(proposalID, {
                from: admin
            });
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "proposal does not have the required amount of votes"
            );
        }

        // vote for the proposal
        let vote = await LendingBoardInstance.vote(proposalID, true, {
            from: admin
        });

        // execute the proposal
        await timeTravel(3600);
        let actualExecute = await LendingBoardInstance.executeProposal(proposalID, { from: admin });

        // check for EVENTS
        assert.strictEqual(actualExecute.logs.length, 2, "triggers two events");

        // check for Membership Changed Event
        assert.strictEqual(
            actualExecute.logs[0].event,
            "MembershipChanged",
            "should be the MembershipChanged event"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.member,
            newUser,
            "should be new user (accounts[1])"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.isMember,
            true,
            "member status should be true"
        );

        // check for Proposal Tallied Event
        assert.strictEqual(
            actualExecute.logs[1].event,
            "ProposalTallied",
            "should be the ProposalTallied event"
        );
        assert.strictEqual(
            actualExecute.logs[1].args.proposalID.toNumber(),
            proposalID.toNumber(),
            "should be proposalID"
        );
        assert.strictEqual(
            actualExecute.logs[1].args.result.toNumber(),
            propPosVotes,
            "should be 1 positive vote"
        );
        assert.strictEqual(
            actualExecute.logs[1].args.quorum.toNumber(),
            propVotes,
            "should be 1 vote"
        );
        assert.strictEqual(actualExecute.logs[1].args.active, true, "proposal should have passed");

        // update numMembers
        numMembers = await LendingBoardInstance.getMembersLength.call();
        numMembers = numMembers.toNumber();

        // check if member was added
        let newMember = await LendingBoardInstance.members.call(numMembers - 1);
        assert.strictEqual(newMember[0], newUser, "should be address of newUser (accounts[1])");
        assert.strictEqual(newMember[1], "newUser", "should be newUser");

        // check if entry in openProposals was removed
        let newLeng = await LendingBoardInstance.getOcLength.call();
        assert.strictEqual(
            newLeng.toNumber(),
            currentOpenProps.toNumber() - 1,
            "should have been removed"
        );
    });

    it("can create a proposal to remove a member as a member and not the owner", async function() {
        // get return value of proposal call for EVENT test
        let pID = await LendingBoardInstance.newMemberProposal.call(newUser, "newUser", "2", {
            from: newUser
        });

        // actually add the proposal to the contract state
        let memberProposal = await LendingBoardInstance.newMemberProposal(newUser, "newUser", "2", {
            from: newUser
        });

        // check if EVENT ProposalAdded was triggered
        assert.strictEqual(memberProposal.logs.length, 1, "triggers one event");
        assert.strictEqual(
            memberProposal.logs[0].event,
            "ProposalAdded",
            "should be the ProposalAdded event"
        );

        assert.strictEqual(
            memberProposal.logs[0].args.ProposalID.toNumber(),
            pID.toNumber(),
            "should be pID"
        );

        assert.strictEqual(
            memberProposal.logs[0].args.description,
            "Remove Member",
            "should be Remove Member"
        );

        // check if Proposal was added to Proposals in the contract
        let newPropLength = await LendingBoardInstance.getPropLength.call();

        // check if Proposal author actually is the newUser
        let prop = await LendingBoardInstance.Proposals.call(newPropLength - 1);
        assert.strictEqual(prop.author, newUser, "should be newUser (accounts[1])");

        // check if Proposal is removeMember proposal
        assert.strictEqual(
            prop.fnNumber.toNumber(),
            2,
            "should be 2 (internal encoding for remove Member)"
        );
        assert.strictEqual(prop.description, "Remove Member", "should be Remove Member");
    });

    it("can vote against proposal and changes are not made when executed", async function() {
        // get ID of proposal to execute
        proposalID = await LendingBoardInstance.openProposals.call(0);

        // update number of currentOpenProps
        currentOpenProps = await LendingBoardInstance.getOcLength.call();

        // vote against the proposal to remove newUser from the contract
        let vote = await LendingBoardInstance.vote(proposalID.toNumber(), false, { from: admin });

        // check if EVENT Voted was emitted
        assert.strictEqual(vote.logs.length, 1, "triggers one event");
        assert.strictEqual(vote.logs[0].event, "Voted", "should be the Voted event");
        assert.strictEqual(
            vote.logs[0].args.ProposalID.toNumber(),
            proposalID.toNumber(),
            "wrong proposalID"
        );
        assert.strictEqual(vote.logs[0].args.stanceOnProposal, false, "should be true");
        assert.strictEqual(vote.logs[0].args.voter, admin, "should be admin");

        // execute the proposal
        await timeTravel(3600);
        let actualExecute = await LendingBoardInstance.executeProposal(proposalID, { from: admin });

        // check for EVENT
        assert.strictEqual(actualExecute.logs.length, 1, "triggers one event");

        // check for Proposal Tallied Event
        assert.strictEqual(
            actualExecute.logs[0].event,
            "ProposalTallied",
            "should be the ProposalTallied event"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.proposalID.toNumber(),
            proposalID.toNumber(),
            "should be proposalID"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.result.toNumber(),
            0,
            "should have no positive votes"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.quorum.toNumber(),
            propVotes,
            "should be 1 vote"
        );
        assert.strictEqual(
            actualExecute.logs[0].args.active,
            false,
            "proposal should have failed!"
        );

        // check that numMembers has not changed
        let oldNumMembers = numMembers;

        numMembers = await LendingBoardInstance.getMembersLength.call();
        assert.strictEqual(numMembers.toNumber(), oldNumMembers, "should be equal");

        // check if newUser is still member number 2
        let stillMember = await LendingBoardInstance.members.call(numMembers - 1);
        assert.strictEqual(stillMember[0], newUser, "should be address of newUser (accounts[1])");
        assert.strictEqual(stillMember[1], "newUser", "should be newUser");

        // check if entry in openProposals was removed
        let newLeng = await LendingBoardInstance.getOcLength.call();
        assert.strictEqual(
            newLeng.toNumber(),
            currentOpenProps.toNumber() - 1,
            "should have been removed"
        );

        // check if proposal tags were updated
        let prop = await LendingBoardInstance.Proposals.call(proposalID);
        assert.strictEqual(prop.executed, true, "should have been executed");
        assert.strictEqual(prop.proposalPassed, false, "should not have passed");
    });

    it("can remove a member", async function() {
        // get return value of proposal call for EVENT test
        let pID = await LendingBoardInstance.newMemberProposal.call(newUser, "newUser", "2", {
            from: admin
        });

        // actually add the proposal to the contract state
        let memberProposal = await LendingBoardInstance.newMemberProposal(newUser, "newUser", "2", {
            from: admin
        });

        // check if EVENT ProposalAdded was triggered
        assert.strictEqual(memberProposal.logs.length, 1, "triggers one event");
        assert.strictEqual(
            memberProposal.logs[0].event,
            "ProposalAdded",
            "should be the ProposalAdded event"
        );

        // vote for the proposal

        let vote = await LendingBoardInstance.vote(pID.toNumber(), true, { from: admin });

        // check if EVENT Voted was triggered
        assert.strictEqual(vote.logs.length, 1, "triggers one event");
        assert.strictEqual(vote.logs[0].event, "Voted", "should be the Voted Event");

        // advance the clock by 1 hour
        await timeTravel(3600);

        // execute the proposal as a member not the owner
        let actualExecute = await LendingBoardInstance.executeProposal(pID.toNumber(), {
            from: newUser
        });

        // check if EVENTS were triggered during execution
        assert.strictEqual(actualExecute.logs.length, 2, "triggers two events");

        // check for EVENT MembershipChanged
        assert.strictEqual(
            actualExecute.logs[0].event,
            "MembershipChanged",
            "should be MembershipChanged"
        );
        assert.strictEqual(actualExecute.logs[0].args.member, newUser, "should be newUser");
        assert.strictEqual(actualExecute.logs[0].args.isMember, false, "should be false");

        // check for EVENT ProposalTallied
        assert.strictEqual(
            actualExecute.logs[1].event,
            "ProposalTallied",
            "should be ProposalTallied"
        );

        // check if member was removed
        let nnl = await LendingBoardInstance.getMembersLength.call();
        assert.strictEqual(
            nnl.toNumber(),
            numMembers.toNumber() - 1,
            "should be one fewer member than before"
        );
    });

    it("remove Member edge cases", async function() {
        // try to create a proposal as a previously removed member
        try {
            let dummyProposal = await LendingBoardInstance.newFeeProposal(200, { from: newUser });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "you are not a member or the owner");
        }

        // try to remove the owner

        // get return value of create Proposal (does not change the state of the contract)
        let pID = await LendingBoardInstance.newMemberProposal.call(admin, "admin", "2", {
            from: admin
        });

        // create the actual proposal to remove the owner (changes the state of the contract)
        let memberProposal = await LendingBoardInstance.newMemberProposal(admin, "admin", "2", {
            from: admin
        });

        // vote for the proposal

        // try to vote for the proposal with a member that does not exist anymore
        try {
            let dummyVote = await LendingBoardInstance.vote(pID.toNumber(), true, {
                from: newUser
            });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "you are not a member or the owner");
        }

        // actually vote for the proposal
        let vote = await LendingBoardInstance.vote(pID.toNumber(), true, { from: admin });

        // fast forward 1 hour
        await timeTravel(3600);

        // try to execute the proposal to remove the owner

        try {
            let dummyExecute = await LendingBoardInstance.executeProposal(pID.toNumber(), {
                from: admin
            });
        } catch (err) {
            assert(err.message.indexOf("revert") >= 0, "cannot remove the owner via proposal");
        }

        // try to remove a memeber that does not exist

        // get return value of create Proposal (does not change the state of the contract)
        pID = await LendingBoardInstance.newMemberProposal.call(nonMember, "nonMember", "2", {
            from: admin
        });

        // create the actual proposal to remove the owner (changes the state of the contract)
        memberProposal = await LendingBoardInstance.newMemberProposal(nonMember, "nonMember", "2", {
            from: admin
        });

        // vote for the proposal
        vote = await LendingBoardInstance.vote(pID.toNumber(), true, { from: admin });

        // fast forward 1 hour
        await timeTravel(3600);

        // try to execute the proposal

        try {
            let dummyExecute = await LendingBoardInstance.executeProposal(pID.toNumber(), {
                from: admin
            });
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "cannot remove a member that does not exist"
            );
        }
    });
});
