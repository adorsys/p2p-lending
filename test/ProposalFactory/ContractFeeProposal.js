const ContractFeeProposal = artifacts.require(
    "./ProposalFactory/ContractFeeProposal.sol"
);

contract("ContractFeeProposal", accounts => {
    beforeEach(async () => {
        author = accounts[0];
        secondVoter = accounts[1];
        proposedFee = web3.utils.toWei("1000", "finney");
        minimumNumberOfVotes = 2;
        majorityMargin = 50;
        managementContract = author;

        contractFeeProposal = await ContractFeeProposal.new(
            author,
            proposedFee,
            minimumNumberOfVotes,
            majorityMargin,
            managementContract,
            { from: author }
        );
    });

    it("contract deployed", async () => {
        assert.notStrictEqual(
            contractFeeProposal.address,
            0x0000000000000000000000000000000000000000,
            "contractFee proposal does not have address"
        );
    });

    it("second vote from the same address fails", async () => {
        await contractFeeProposal.vote(true, author, {
            from: author
        });
        // second vote from same address
        try {
            await contractFeeProposal.vote.call(true, author, { from: author });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "second vote from same address should fail with revert"
            );
        }
    });

    it("positive vote triggers execute with change to fee", async () => {
        // first vote
        await contractFeeProposal.vote(true, author, {
            from: author
        });
        // second vote should trigger execution
        let vote = await contractFeeProposal.vote(true, secondVoter, {
            from: author
        });
        // does execution trigger expected event with expected parameters
        assert.strictEqual(vote.logs.length, 1, "should trigger 1 events");
        assert.strictEqual(
            vote.logs[0].event,
            "ProposalExecuted",
            "should be ProposalExecuted"
        );
        assert.strictEqual(
            vote.logs[0].args.ContractFeeProposal,
            contractFeeProposal.address,
            "should be the address of the proposal"
        );
        assert.strictEqual(
            parseInt(vote.logs[0].args.numberOfPositiveVotes, 10),
            2,
            "should be 2 positive votes"
        );
        assert.strictEqual(
            parseInt(vote.logs[0].args.numberOfVotes, 10),
            2,
            "should be 2 votes in total"
        );

        // cannot vote for executed proposal
        try {
            await contractFeeProposal.vote.call(true, author, { from: author });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "second vote from same address should fail with revert"
            );
        }
    });
});
