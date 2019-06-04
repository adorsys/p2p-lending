const RequestManagement = artifacts.require("RequestManagement");
const RequestFactory = artifacts.require("RequestFactory");
const LendingRequest = artifacts.require("LendingRequest");

contract("RequestManagement", accounts => {
    // truffle accounts
    let firstAccount;
    let asker;
    let lender;

    // smart contracts
    let requestManagement;
    let lendingRequest;

    // Request management
    let askerLendingRequestsAddresses;
    let lendingRequestsAmount;
    let askAmount = 2000000000;
    let paybackAmount = 3000000000;
    let purpose = "food";

    // Lending Request contract properties
    let amountAsked;
    let promisedPayback;
    let requestPurpose;
    let askerAddress;
    let moneyLent;
    let debtSettled;
    let contractFee;

    beforeEach(async () => {
        requestManagement = await RequestManagement.new(RequestFactory.address);

        firstAccount = accounts[0];
        asker = accounts[1];
        lender = accounts[2];

        await requestManagement.ask(askAmount, paybackAmount, purpose, {
            from: asker
        });
        lendingRequestsAmount = (await requestManagement.getRequests.call())
            .length;
        askerLendingRequestsAddresses = await requestManagement.getRequests({
            from: firstAccount
        });
        lendingRequest = await LendingRequest.at(
            askerLendingRequestsAddresses[0]
        );

        amountAsked = await lendingRequest.amountAsked.call();
        promisedPayback = await lendingRequest.paybackAmount.call();
        requestPurpose = await lendingRequest.purpose.call();
        askerAddress = await lendingRequest.asker.call();
        moneyLent = await lendingRequest.moneyLent.call();
        debtSettled = await lendingRequest.debtSettled.call();
        contractFee = await lendingRequest.contractFee.call();
    });

    it("contracts deployed", async () => {
        assert.notStrictEqual(
            requestManagement.address,
            0x0,
            "base contract does not have address"
        );
    });

    it("lending request successfully submitted but not granted and not settled", async () => {
        // assert amount of lending requests for the asker
        expect(parseInt(lendingRequestsAmount, 10)).to.equal(1);
        // check asker address
        expect(askerAddress).to.equal(asker);
        // check if ask amount is the same
        expect(parseInt(amountAsked, 10)).to.equal(askAmount);
        // check if payback amount is the same
        expect(parseInt(promisedPayback, 10)).to.equal(paybackAmount);
        // check that lending request has not been settled yet
        expect(debtSettled).to.equal(false);
        // check lending request purpose
        expect(requestPurpose).to.equal(purpose);
        // check that lending request has not been granted yet
        expect(moneyLent).to.equal(false);
    });

    it("lending request successfully submitted and granted but not settled", async () => {
        // grant money to the lending request
        await requestManagement.deposit(askerLendingRequestsAddresses[0], {
            from: lender,
            value: askAmount
        });
        // actualizing only "moneyLent" and "debtSettled"  properties
        moneyLent = await lendingRequest.moneyLent.call();
        debtSettled = await lendingRequest.debtSettled.call();
        // assert amount of lending requests for the asker
        expect(parseInt(lendingRequestsAmount, 10)).to.equal(1);
        // check asker address
        expect(askerAddress).to.equal(asker);
        // check lender address
        expect(askerAddress).to.equal(asker);
        // check if ask amount is the same
        expect(parseInt(amountAsked, 10)).to.equal(askAmount);
        // check if payback amount is the same
        expect(parseInt(promisedPayback, 10)).to.equal(paybackAmount);
        // check lending request purpose
        expect(requestPurpose).to.equal(purpose);
        // check that lending request has not been granted yet
        expect(moneyLent).to.equal(true);
        // check that lending request has not been settled yet
        expect(debtSettled).to.equal(false);
    });

    it("lending request successfully submitted, granted and settled", async () => {
        // grant money to the lending request
        await requestManagement.deposit(askerLendingRequestsAddresses[0], {
            from: lender,
            value: askAmount
        });
        await requestManagement.deposit(askerLendingRequestsAddresses[0], {
            from: asker,
            value: paybackAmount + parseInt(contractFee, 10)
        });

        amountAsked = await lendingRequest.amountAsked.call();
        promisedPayback = await lendingRequest.paybackAmount.call();
        requestPurpose = await lendingRequest.purpose.call();
        askerAddress = await lendingRequest.asker.call();
        moneyLent = await lendingRequest.moneyLent.call();
        debtSettled = await lendingRequest.debtSettled.call();

        // assert amount of lending requests for the asker
        expect(parseInt(lendingRequestsAmount, 10)).to.equal(1);
        // check asker address
        expect(askerAddress).to.equal(asker);
        // check lender address
        expect(askerAddress).to.equal(asker);
        // check if ask amount is the same
        expect(parseInt(amountAsked, 10)).to.equal(askAmount);
        // check if payback amount is the same
        expect(parseInt(promisedPayback, 10)).to.equal(paybackAmount);
        // check lending request purpose
        expect(requestPurpose).to.equal(purpose);
        // check that lending request has not been granted yet
        expect(moneyLent).to.equal(true);
        // check that lending request has not been settled yet
        expect(debtSettled).to.equal(true);
    });
});
