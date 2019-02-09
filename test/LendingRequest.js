const LendingRequest = artifacts.require("./LendingRequest.sol");

contract("LendingRequest", accounts => {
    before(async () => {
        asker = accounts[0];
        lender = accounts[1];
        managementContract = accounts[2];
        other = accounts[9];

        lendingRequest = await LendingRequest.new(
            asker,
            true,
            web3.utils.toWei("1", "ether"),
            web3.utils.toWei("2", "ether"),
            web3.utils.toWei("1", "ether"),
            "food",
            managementContract
        );
    });

    it("transfer of funds not possible with fallback", async () => {
        try {
            await lendingRequest.send(web3.utils.toWei("1", "ether"));
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "factory does not accept ETH"
            );
        }
    });

    it("can lend ETH contract with all sideeffects", async () => {
        let deposit = await lendingRequest.deposit(lender, {
            from: lender,
            value: web3.utils.toWei("1", "ether")
        });

        // triggers the MoneyLent Event with expected parameters
        assert.strictEqual(deposit.logs.length, 1, "should trigger 1 event");
        assert.strictEqual(
            deposit.logs[0].event,
            "MoneyLent",
            "should be MoneyLent"
        );
        assert.strictEqual(
            deposit.logs[0].args.lendingRequest,
            lendingRequest.address,
            "should be lendingRequest"
        );
        assert.strictEqual(
            parseInt(deposit.logs[0].args.amount, 10),
            parseInt(web3.utils.toWei("1", "ether"), 10),
            "should be 1 ETH"
        );

        // sets moneyLent flag, registers lender and rejects further deposits
        let moneyLent = await lendingRequest.moneyLent.call();
        assert.strictEqual(
            moneyLent,
            true,
            "moneyLent flag should be set to true"
        );
        let lenderForCurrentRequest = await lendingRequest.lender.call();
        assert.strictEqual(lenderForCurrentRequest, lender, "should be lender");

        try {
            await lendingRequest.deposit(lender, {
                from: lender,
                value: web3.utils.toWei("1", "ether")
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "factory does not accept ETH"
            );
        }
    });
});
