const LendingRequestFactory = artifacts.require("./LendingRequestFactory.sol");

contract("LendingRequestFactory", accounts => {
    before(async () => {
        asker = accounts[0];
        lender = accounts[1];
        factoryInstance = await LendingRequestFactory.new({
            from: asker
        });
    });

    it("Factory gets created and is working", async () => {
        let newRequest = await factoryInstance.newLendingRequest(
            500,
            1000,
            "test",
            {
                from: asker
            }
        );

        // check if lendingRequest can be found in management structures
        let askerRequests = await factoryInstance.getRequests(asker);
        assert.strictEqual(
            askerRequests.length,
            1,
            "asker should have 1 request"
        );
        let contractRequests = await factoryInstance.getRequests(
            factoryInstance.address
        );
        assert.strictEqual(
            contractRequests.length,
            1,
            "factory should manage 1 request"
        );

        // check if found contracts are the same
        assert.strictEqual(
            askerRequests[0],
            contractRequests[0],
            "both contract addresses should match"
        );

        // creation of request triggers event
        assert.strictEqual(
            newRequest.logs.length,
            1,
            "creation of request should trigger 1 event"
        );
        assert.strictEqual(
            newRequest.logs[0].event,
            "RequestCreated",
            "Event should be RequestCreated"
        );
        assert.strictEqual(
            newRequest.logs[0].args.request,
            askerRequests[0],
            "Event should emit the correct Request address"
        );
    });

    it("Factory cannot receive funds", async () => {
        try {
            await factoryInstance.send(web3.utils.toWei("0.1", "ether"), {
                from: asker
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "cannot transfer ether to the factory contract"
            );
        }
    });
});
