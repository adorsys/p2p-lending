// const Base = artifacts.require("./Base.sol");
// const LendingBoard = artifacts.require("./LendingBoard.sol");

const LendingRequestFactory = artifacts.require("./LendingRequestFactory.sol");
// const LendingRequest = artifacts.require("./LendingRequest");

// const minimumQuorum = 1;
// const minutesForDebate = 30;
// const majorityMargin = 50;

module.exports = async deployer => {
    // await deployer.deploy(
    //     LendingBoard,
    //     minimumQuorum,
    //     minutesForDebate,
    //     majorityMargin
    // );
    // await deployer.deploy(Base, LendingBoard.address);
    await deployer.deploy(LendingRequestFactory);
};
