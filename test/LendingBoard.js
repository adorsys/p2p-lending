const LendingBoard = artifacts.require("./LendingBoard.sol");
const Web3 = require("web3");
const web3 = new Web3("ws://127.0.0.1:8545");

// add functionality to change the local time to test functions
// that can only be called after a certain amount of time has passed
// 1 day is equal to 86400 seconds

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
    const nonMember = accounts[9];
    let LendingBoardInstance;
    let proposalID;
    let currentOpenProps;
    let propVotes;
    let propPosVotes;
    const proposedFee = 200;

    it("initializes the lending board correctly", async function() {
        LendingBoardInstance = await LendingBoard.deployed();
        assert.notStrictEqual(
            LendingBoardInstance.address,
            0x0,
            "has board address"
        );

        let fee = await LendingBoardInstance.contractFee.call();
        assert.strictEqual(fee.toNumber(), 1000, "sets contract fee correctly");

        let minimumQuorum = await LendingBoardInstance.minimumQuorum.call();
        assert.strictEqual(
            minimumQuorum.toNumber(),
            1,
            "sets minimum quorum correctly"
        );

        let debatingPeriod = await LendingBoardInstance.debatingPeriodInMinutes.call();
        assert.strictEqual(
            debatingPeriod.toNumber(),
            0,
            "sets debating period correctly"
        );

        let majorityMargin = await LendingBoardInstance.majorityMargin.call();
        assert.strictEqual(
            majorityMargin.toNumber(),
            50,
            "sets majority margin correctly"
        );

        let firstMember = await LendingBoardInstance.members.call(0);
        assert.strictEqual(
            firstMember[1],
            "owner",
            "adds owner as first member"
        );
        assert.strictEqual(firstMember[0], admin, "adds owner as first member");
    });

    it("can create a proposal to change the contract fee", async function() {
        // try to create a proposal without being a member of the board
        try {
            let nonMemberProposal = await LendingBoardInstance.newFeeProposal(
                200,
                { from: nonMember }
            );
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }

        // try to create a proposal with too low a fee
        try {
            let wrongFeeProposal = await LendingBoardInstance.newFeeProposal(
                50,
                { from: admin }
            );
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "fee must be higher than 100"
            );
        }

        // get return value of newFeeProposal function but do not change the state of the contract
        let pID = await LendingBoardInstance.newFeeProposal.call(proposedFee);
        // actually create a newFeeProposal (changes state of the contract)
        let proposal = await LendingBoardInstance.newFeeProposal(proposedFee);

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
        assert.strictEqual(
            numProps.toNumber(),
            1,
            "only one proposal should have been added"
        );

        currentOpenProps = await LendingBoardInstance.getOcLength.call();
        currentOpenProps = currentOpenProps.toNumber();
        assert.strictEqual(
            currentOpenProps,
            1,
            "should only be one open proposal"
        );
    });

    it("can get and check the created proposal", async function() {
        proposalID = await LendingBoardInstance.openProposals.call(0);
        let prop = await LendingBoardInstance.Proposals.call(
            proposalID.toNumber()
        );
        propVotes = prop.numberOfVotes.toNumber();
        propPosVotes = prop.positiveVotes.toNumber();
        assert.strictEqual(prop[0], admin, "should come from the admin");
        assert.strictEqual(
            prop.proposedFee.toNumber(),
            200,
            "proposed fee should be 200"
        );
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
        assert.strictEqual(
            dummyVote.toNumber(),
            propVotes + 1,
            "should be 1 more than prop"
        );

        // vote and change state of contract
        let vote = await LendingBoardInstance.vote(proposalID, true, {
            from: admin
        });
        // increase internal vote count
        propVotes++;
        propPosVotes++;

        // check for vote event
        assert.strictEqual(vote.logs.length, 1, "triggers one event");
        assert.strictEqual(
            vote.logs[0].event,
            "Voted",
            "should be the Voted event"
        );
        assert.strictEqual(
            vote.logs[0].args.ProposalID.toNumber(),
            proposalID.toNumber(),
            "wrong proposalID"
        );
        assert.strictEqual(
            vote.logs[0].args.stanceOnProposal,
            true,
            "should be true"
        );
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
            assert(
                err.message.indexOf("revert") >= 0,
                "you can only vote once"
            );
        }
    });

    it("can execute the next proposal", async function() {
        // try to execute the proposal without being a member of the board
        try {
            let dummyExecute = await LendingBoardInstance.executeProposal.call(
                proposalID,
                { from: nonMember }
            );
        } catch (err) {
            assert(
                err.message.indexOf("revert") >= 0,
                "can only be called by members of the board"
            );
        }
        let actualExecute = await LendingBoardInstance.executeProposal(
            proposalID
        );

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
        assert.strictEqual(
            actualExecute.logs[0].args.active,
            true,
            "proposal should have passed"
        );

        // check if contract fee was updated
        let actualFee = await LendingBoardInstance.contractFee.call();
        assert.strictEqual(actualFee.toNumber(), proposedFee, "should be 200");

        // check if proposal had the expected tag changes
        let executedProposal = await LendingBoardInstance.Proposals.call(
            proposalID
        );

        assert.strictEqual(
            executedProposal.executed,
            true,
            "should be executed and true"
        );
        assert.strictEqual(
            executedProposal.proposalPassed,
            true,
            "should have passed and true"
        );

        // check if entry in openProposals was removed
        let newLeng = await LendingBoardInstance.getOcLength.call();
        assert.strictEqual(newLeng.toNumber(), 0, "should have been removed");
    });

    it("should successfully call specialFn because enough time has passed", async function() {
        try {
            await timeTravel(86400 * 3);
            let status = await LendingBoardInstance.specialFn.call();
            console.log(status);
        } catch (err) {
            console.log(err);
        }
    });
});
