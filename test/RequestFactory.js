const RequestFactory = artifacts.require("RequestFactory");
const LendingRequest = artifacts.require("LendingRequest");
const ProposalManagement = artifacts.require("ProposalManagement");
const TrustToken = artifacts.require("TrustToken");

contract("RequestFactory", accounts => {
    beforeEach(async () => {
        asker = accounts[0];
        lender = accounts[1];
        requestFactory = await RequestFactory.new(
            TrustToken.address,
            ProposalManagement.address,
            { from: asker }
        );
    });

    it("create new LendingRequest", async () => {
        // create lendingRequest
        let lendingRequest = await requestFactory.createLendingRequest.call(
            1,
            2,
            "test",
            asker
        );
        assert.notStrictEqual(
            lendingRequest,
            0x0000000000000000000000000000000000000000,
            "should create a valid lending Request"
        );
    });

    it("factory cannot receive ETH", async () => {
        try {
            await requestFactory.send(web3.utils.toWei("1", "ether"));
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "factory does not accept ETH"
            );
        }
    });

    // Missing: Can validate User via Uport
});
