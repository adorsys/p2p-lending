const TrustToken = artifacts.require("TrustToken");

contract("TrustToken-Functionality", accounts => {
    // truffle accounts
    let firstTokenHolder;
    let secondTokenHolder;
    let nonTokenHolder;

    // smart contract
    let trustToken;

    // trustToken parameters
    const tokenSupply = 1000;
    const tokenName = "TrustToken";
    const tokenSymbol = "TT";
    const decimals = 18;

    // trustToken values
    const firstInvestment = web3.utils.toWei("6", "ether");
    const secondInvestment = web3.utils.toWei("4", "ether");
    const tokenAmount_first = web3.utils.toWei("600", "ether");
    const tokenAmount_second = web3.utils.toWei("400", "ether");

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

        await trustToken.participate({
            from: firstTokenHolder,
            value: firstInvestment
        });
        await trustToken.participate({
            from: secondTokenHolder,
            value: secondInvestment
        });

        icoActive = await trustToken.isIcoActive.call();
    });

    it("participate() and distribute()", async () => {
        // validate ico status
        expect(icoActive).to.be.false;

        // prepare contract info transactions
        const participantsTransaction = trustToken.trusteeCount.call();
        const tokenForFirstHolderTransaction = trustToken.balanceOf.call(
            firstTokenHolder
        );
        const tokenForSecondHolderTransaction = trustToken.balanceOf.call(
            secondTokenHolder
        );
        const transactions = [
            participantsTransaction,
            tokenForFirstHolderTransaction,
            tokenForSecondHolderTransaction
        ];

        // resolve contract info transactions
        const [
            participants,
            tokenForFirstHolder,
            tokenForSecondHolder
        ] = await Promise.all(transactions);

        // validate number of participants
        expect(participants.toString()).to.equal(String(2));

        // validate distribution of token
        expect(tokenForFirstHolder.toString()).to.equal(tokenAmount_first);
        expect(tokenForSecondHolder.toString()).to.equal(tokenAmount_second);
    });

    it("transfer() limitations", async () => {
        // invalid transferAmount throws
        let transferAmount = web3.utils.toWei(String(9999), "ether");
        try {
            await trustToken.transfer(nonTokenHolder, transferAmount, {
                from: firstTokenHolder
            });
        } catch (error) {
            assert(error.message.indexOf("revert") >= 0, "invalid tokenAmount");
        }

        // invalid origin throws
        transferAmount = web3.utils.toWei(String(200), "ether");
        try {
            await trustToken.transfer(secondTokenHolder, transferAmount, {
                from: nonTokenHolder
            });
        } catch (error) {
            assert(error.message.indexOf("revert") >= 0, "invalid origin");
        }
    });

    it("transfer() of token", async () => {
        const transferAmount = web3.utils.toWei(String(200), "ether");
        const transferToken = await trustToken.transfer(
            nonTokenHolder,
            transferAmount,
            {
                from: firstTokenHolder
            }
        );
        // Transfer event gets triggered
        expect(transferToken.logs).to.have.lengthOf(1);
        expect(transferToken.logs[0].event).to.equal("Transfer");
        expect(transferToken.logs[0].args._from).to.equal(firstTokenHolder);
        expect(transferToken.logs[0].args._to).to.equal(nonTokenHolder);
        expect(transferToken.logs[0].args._value.toString()).to.equal(
            transferAmount
        );

        // prepare contract info transactions
        const firstTokenAmountTransaction = trustToken.balanceOf.call(
            firstTokenHolder
        );
        const nonTokenAmountTransaction = trustToken.balanceOf.call(
            nonTokenHolder
        );
        const nonTrusteeStatusTransaction = trustToken.isTrustee.call(
            nonTokenHolder
        );
        const transactions = [
            firstTokenAmountTransaction,
            nonTokenAmountTransaction,
            nonTrusteeStatusTransaction
        ];

        // resolve transactions
        const [
            firstTokenAmount,
            nonTokenAmount,
            nonTrusteeStatus
        ] = await Promise.all(transactions);
        const accountDifference =
            parseInt(tokenAmount_first, 10) - parseInt(firstTokenAmount, 10);

        // origin has transferAmount removed from account
        expect(accountDifference.toString()).to.equal(transferAmount);

        // target gets token added to account
        expect(nonTokenAmount.toString()).to.equal(transferAmount);

        // target gets registered as trustee
        expect(nonTrusteeStatus).to.be.true;
    });

    it("approve() limitations", async () => {
        // approval with insufficient funds throws
        try {
            await trustToken.approve(firstTokenHolder, tokenAmount_first, {
                from: nonTokenHolder
            });
        } catch (error) {
            assert(error.message.indexOf("revert") >= 0, "insufficient funds");
        }

        // approval of excess amount throws
        const transferAmount = web3.utils.toWei(String(9999), "ether");
        try {
            await trustToken.approve(nonTokenHolder, transferAmount, {
                from: firstTokenHolder
            });
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "approval should throw"
            );
        }
    });

    it("approve() another account", async () => {
        // approve nonTokenHolder to spend token of firstTokenHolder
        const approval = await trustToken.approve(
            nonTokenHolder,
            tokenAmount_second,
            { from: firstTokenHolder }
        );

        // Approval triggers expected event(s)
        expect(approval.logs).to.have.lengthOf(
            1,
            "should only trigger approval event"
        );

        // triggeres "Approval"
        expect(approval.logs[0].event).to.equal("Approval");

        // Event has expected parameters
        expect(approval.logs[0].args._owner).to.equal(
            firstTokenHolder,
            "should be account[0]"
        );
        expect(approval.logs[0].args._spender).to.equal(
            nonTokenHolder,
            "should be account[9]"
        );
        expect(approval.logs[0].args._value.toString()).to.equal(
            tokenAmount_second,
            "should equal 400 Token ( * 10 ** 18 )"
        );

        // allowance of nonTokenHolder gets updated
        const allowance = await trustToken.allowance.call(
            firstTokenHolder,
            nonTokenHolder
        );
        expect(allowance.toString()).to.equal(tokenAmount_second);
    });

    it("transferFrom() limitations", async () => {
        // transfer without allowance
        try {
            await trustToken.transferFrom(
                firstTokenHolder,
                nonTokenHolder,
                tokenAmount_second,
                { from: nonTokenHolder }
            );
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "transferFrom should revert"
            );
        }

        await trustToken.approve(nonTokenHolder, tokenAmount_second, {
            from: firstTokenHolder
        });

        // transfer over current allowance
        try {
            await trustToken.transferFrom(
                firstTokenHolder,
                nonTokenHolder,
                tokenAmount_first,
                { from: nonTokenHolder }
            );
        } catch (error) {
            assert(
                error.message.indexOf("revert") >= 0,
                "transferFrom should revert"
            );
        }
    });

    it("transferFrom() another account", async () => {
        await trustToken.approve(nonTokenHolder, tokenAmount_second, {
            from: firstTokenHolder
        });

        const transferAmount = (tokenAmount_second / 2).toString();

        // transferFrom
        const transferFrom = await trustToken.transferFrom(
            firstTokenHolder,
            nonTokenHolder,
            transferAmount,
            { from: nonTokenHolder }
        );

        // transferFrom triggers expected event(s)
        expect(transferFrom.logs).to.have.lengthOf(1);

        // triggered event has expected parameters
        expect(transferFrom.logs[0].event).to.equal("Transfer");
        expect(transferFrom.logs[0].args._from).to.equal(firstTokenHolder);
        expect(transferFrom.logs[0].args._to).to.equal(nonTokenHolder);
        expect(transferFrom.logs[0].args._value.toString()).to.equal(
            transferAmount
        );

        // contract state was updated
        // prepare transactions
        const firstTokenHolderBalanceTransaction = trustToken.balanceOf.call(
            firstTokenHolder
        );
        const nonTokenHolderBalanceTransaction = trustToken.balanceOf.call(
            nonTokenHolder
        );
        const nonTokenHolderStatusTransaction = trustToken.isTrustee.call(
            nonTokenHolder
        );
        const nonTokenHolderAllowanceTransaction = trustToken.allowance.call(
            firstTokenHolder,
            nonTokenHolder
        );
        const transactions = [
            firstTokenHolderBalanceTransaction,
            nonTokenHolderBalanceTransaction,
            nonTokenHolderStatusTransaction,
            nonTokenHolderAllowanceTransaction
        ];

        // resolve transactions
        const [
            firstTokenHolderBalance,
            nonTokenHolderBalance,
            nonTokenHolderStatus,
            nonTokenHolderAllowance
        ] = await Promise.all(transactions);

        // token were removed from firstTokenHolder
        expect(firstTokenHolderBalance.toString()).to.equal(tokenAmount_second);
        // token were added to nonTokenHolder
        expect(nonTokenHolderBalance.toString()).to.equal(transferAmount);
        // nonTokenHolder is trustee
        expect(nonTokenHolderStatus).to.be.true;
        // allowance of nonTokenHolder was updated
        expect(nonTokenHolderAllowance.toString()).to.equal(transferAmount);
    });
});
