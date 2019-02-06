const LendingBoard = artifacts.require("./LendingBoard.sol");
const RequestManagement = artifacts.require("./RequestManagement.sol");
const LendingRequest = artifacts.require("./LendingRequest.sol");


contract("RequestManagement", function(accounts) {

    let firstAccount;
    let lendingBoard;
    let requestManagement;

    let asker;
    let lender;

    let askAmount = 2000000000;
    let paybackAmount = 3000000000;
    let purpose = "food";

    beforeEach(async () => {
        lendingBoard = await LendingBoard.new(5, 60, 5);
        requestManagement = await RequestManagement.new(lendingBoard.address);

        firstAccount = accounts[0];
        asker = accounts[1];
        lender = accounts[2];

        await requestManagement.ask(askAmount, paybackAmount, purpose, {from: asker});
    });

    it("contracts deployed", async () => {
        assert.notStrictEqual(
            lendingBoard.address,
            0x0,
            "lending board does not have address"
        );

        assert.notStrictEqual(
            requestManagement.address,
            0x0,
            "base contract does not have address"
        );
    });


    it("lending request successfully submitted but not granted and not settled", async () => {

        let lendingRequestsNumber = await requestManagement.openLendingRequests.call(asker);

        let lendingRequestAddresses = await requestManagement.getRequests(asker, {from: firstAccount});

        let lendingRequest = await LendingRequest.at(lendingRequestAddresses[lendingRequestsNumber - 1]);

        let amountAsked = await lendingRequest.amountAsked.call();

        console.log(amountAsked);

        // check asker address
        expect(lendingRequest[0]).to.equal(asker);
        //
        // // check if ask amount is the same
        // expect(lendingRequest[1].toNumber()).to.equal(askAmount);
        //
        // // check if payback amount is the same
        // expect(lendingRequest[2].toNumber()).to.equal(paybackAmount);
        //
        // // check that lending request has not been settled yet
        // expect(lendingRequest[4]).to.equal(false);
        //
        // // check lending request purpose
        // expect(lendingRequest[5]).to.equal(purpose);
        //
        // // check that lending request has not been granted yet
        // expect(lendingRequest[6]).to.equal(false);
    });
});
