const TrustToken = artifacts.require("TrustToken");

contract("TrustToken-Participation", accounts => {
    // truffle accounts
    let firstTokenHolder;

    // smart contract
    let trustToken;

    // trustToken parameters
    const tokenSupply = 1000;
    const tokenName = "TrustToken";
    const tokenSymbol = "TT";
    const decimals = 18;

    // trustToken values
    const goalInETH = 10;
    const smallAmount = web3.utils.toWei("3", "ether");
    const goalAmount = web3.utils.toWei(String(goalInETH), "ether");
    const overGoalAmount = web3.utils.toWei("20", "ether");
    const supply = web3.utils.toWei(String(tokenSupply), "ether");

    // trustToken properties
    let icoActive;

    beforeEach(async () => {
        firstTokenHolder = accounts[0];
        secondTokenHolder = accounts[1];
        nonTokenHolder = accounts[9];

        trustToken = await TrustToken.new(
            tokenSupply,
            tokenName,
            decimals,
            tokenSymbol
        );

        icoActive = await trustToken.isIcoActive.call();
    });

    it("TrustToken gets deployed", async () => {
        expect(icoActive).to.be.true;
    });

    it("participate with transaction under goal", async () => {
        const participate = await trustToken.participate({
            from: firstTokenHolder,
            value: smallAmount
        });

        // participation triggers Participated event
        expect(participate.logs).to.have.lengthOf(
            1,
            "invalid number of events"
        );
        expect(participate.logs[0].event).to.equal("Participated");

        // prepare transactions to get contract data
        const trusteeBalanceTransaction = trustToken.etherBalances.call(
            firstTokenHolder,
            { from: firstTokenHolder }
        );
        const trusteeInfoTransaction = trustToken.isTrustee.call(
            firstTokenHolder,
            {
                from: firstTokenHolder
            }
        );
        const transactions = [
            trusteeBalanceTransaction,
            trusteeInfoTransaction
        ];

        // resolve transaction data
        const [trusteeBalance, trusteeInfo] = await Promise.all(transactions);

        // investment of firstTokenHolder is registered
        expect(trusteeBalance.toString()).to.equal(smallAmount);

        // investor is registered as participant and trustee
        expect(trusteeInfo).to.be.true;
    });

    it("participate with transaction equal to goal", async () => {
        const participate = await trustToken.participate({
            from: firstTokenHolder,
            value: goalAmount
        });
        // transaction events
        expect(participate.logs).to.have.lengthOf(
            3,
            "invalid number of events"
        );
        // transfer event has expected arguments
        expect(participate.logs[1].event).to.equal("Transfer");
        expect(participate.logs[1].args._from).to.equal(trustToken.address);
        expect(participate.logs[1].args._to).to.equal(firstTokenHolder);
        // icofinished event
        expect(participate.logs[2].event).to.equal("ICOFinished");

        // prepare transactions to get transaction data
        const trusteeTokenBalanceTransaction = trustToken.balanceOf.call(
            firstTokenHolder
        );
        const trusteeCountTransaction = trustToken.trusteeCount.call();
        const transactions = [
            trusteeTokenBalanceTransaction,
            trusteeCountTransaction
        ];
        // resolve transaction data
        const [trusteeTokenBalance, trusteeCount] = await Promise.all(
            transactions
        );
        // firstTokenHolder posesses all token
        expect(trusteeTokenBalance.toString()).to.be.equal(supply);
        // ico has exactly one trustee
        expect(parseInt(trusteeCount), 10).to.be.equal(1);
    });

    it("participate with transaction over goal refunds excess", async () => {
        const balanceBefore = await web3.eth.getBalance(firstTokenHolder);
        const participate = await trustToken.participate({
            from: firstTokenHolder,
            value: overGoalAmount
        });
        const balanceAfter = await web3.eth.getBalance(firstTokenHolder);
        const refund =
            balanceBefore -
            balanceAfter -
            participate.receipt.gasUsed * 20000000000;
        const refundInETH = web3.utils.fromWei(String(refund), "ether");
        // ICO contract should refund roughly 10 ETH
        expect(parseFloat(refundInETH)).to.be.closeTo(goalInETH, 0.001);
    });
});
