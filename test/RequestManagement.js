const LendingBoard = artifacts.require("./LendingBoard.sol");
const RequestManagement = artifacts.require("./RequestManagement.sol");


contract("RequestManagement", function(accounts) {

    let firstAccount;
    let lendingBoard;
    let base;

    let asker;
    let lender;

    let askAmount = 2000000000;
    let paybackAmount = 3000000000;
    let purpose = "food";

    beforeEach(async () => {
        lendingBoard = await LendingBoard.new(5, 60, 5);
        requestManagement = await RequestManagement.new(lendingBoard.address);

        asker = accounts[1];
        lender = accounts[2];

        // await requestManagement.ask(askAmount, paybackAmount, purpose, {from: asker});
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
});
