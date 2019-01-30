const LendingBoard = artifacts.require("./LendingBoard.sol");
const Base = artifacts.require("./Base.sol");

// add functionality to change the local time to test functions
// that can only be called after a certain amount of time has passed
// 1 hour is equal to 3600 | 1 day is equal to 86400 seconds


contract("Base", function(accounts) {

    let firstAccount;
    let lendingBoard;
    let base;

    let asker;
    let lender;

    let askAmount = 2000000000;
    let paybackAmount = 3000000000;
    let purpose = "food";

    beforeEach(async ()=> {
        lendingBoard = await LendingBoard.new(5, 60, 5);
        base =  await Base.new(lendingBoard.address);

        asker = accounts[1];
        lender = accounts[2];

        await base.ask(askAmount, paybackAmount, purpose, {from: asker});
    });

    it("contracts deployed", async ()=> {
        assert.notStrictEqual(
            lendingBoard.address,
            0x0,
            "lending board does not have address"
        );

        assert.notStrictEqual(
            base.address,
            0x0,
            "base contract does not have address"
        );
    });

    it("lending request successfully submitted but not granted and not settled", async () => {
        let lendingRequest = await base.lendingRequests.call(0);

        // check asker address
        expect(lendingRequest[0]).to.equal(asker);

        // check if ask amount is the same
        expect(lendingRequest[1].toNumber()).to.equal(askAmount);

        // check if payback amount is the same
        expect(lendingRequest[2].toNumber()).to.equal(paybackAmount);

        // check that lending request has not been settled yet
        expect(lendingRequest[4]).to.equal(false);

        // check lending request purpose
        expect(lendingRequest[5]).to.equal(purpose);

        // check that lending request has not been granted yet
        expect(lendingRequest[6]).to.equal(false);
    });

    it("lending request successfully submitted and granted but not settled", async () => {
        // grant lending request from lender address
        await base.lend(0, {from: lender, value: askAmount});

        let lendingRequest = await base.lendingRequests.call(0);

        // check asker address
        expect(lendingRequest[0]).to.equal(asker);

        // check if ask amount is the same
        expect(lendingRequest[1].toNumber()).to.equal(askAmount);

        // check if payback amount is the same
        expect(lendingRequest[2].toNumber()).to.equal(paybackAmount);

        // check the lender address
        expect(lendingRequest[3]).to.equal(lender);

        // check that lending request has not been settled yet
        expect(lendingRequest[4]).to.equal(false);

        // check lending request purpose
        expect(lendingRequest[5]).to.equal(purpose);

        // check that lending request has been successfully granted
        expect(lendingRequest[6]).to.equal(true);
    });

    it("lending request successfully submitted, granted and settled", async () => {
        // grant lending request from lender address
        await base.lend(0, {from: lender, value: askAmount});

        // settle lending request
        await base.settle(0, {from: asker, value: paybackAmount});

        let lendingRequest = await base.lendingRequests.call(0);

        // check asker address
        expect(lendingRequest[0]).to.equal(asker);

        // check if ask amount is the same
        expect(lendingRequest[1].toNumber()).to.equal(askAmount);

        // check if payback amount is the same
        expect(lendingRequest[2].toNumber()).to.equal(paybackAmount);

        // check the lender address
        expect(lendingRequest[3]).to.equal(lender);

        // check that lending request has not been settled yet
        expect(lendingRequest[4]).to.equal(true);

        // check lending request purpose
        expect(lendingRequest[5]).to.equal(purpose);

        // check that lending request has been successfully granted
        expect(lendingRequest[6]).to.equal(true);
    });

});
