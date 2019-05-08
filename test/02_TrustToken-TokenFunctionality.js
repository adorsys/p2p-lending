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

  it("Token distributed and ICO is finished", async () => {
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

  it("cannot transfer invalid tokenAmount to another account", async () => {
    const transferAmount = web3.utils.toWei(String(9999), "ether");
    try {
      await trustToken.transfer(nonTokenHolder, transferAmount, {
        from: firstTokenHolder
      });
    } catch (error) {
      assert(error.message.indexOf("revert") >= 0, "invalid tokenAmount");
    }
  });

  it("cannot transfer token as nonTokenHolder", async () => {
    const transferAmount = web3.utils.toWei(String(200), "ether");
    try {
      await trustToken.transfer(secondTokenHolder, transferAmount, {
        from: nonTokenHolder
      });
    } catch (error) {
      assert(error.message.indexOf("revert") >= 0, "invalid origin");
    }
  });

  it("can transfer valid tokenAmount to another account", async () => {
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
    const nonTokenAmountTransaction = trustToken.balanceOf.call(nonTokenHolder);
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
});
