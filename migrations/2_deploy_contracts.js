const Base = artifacts.require("./Base.sol");
const LendingBoard = artifacts.require("./Lending_board.sol");

module.exports = function (deployer) {
    deployer.deploy(Base)
        .then(function () {
            const minQuorum = 1;
            const minsForDebate = 0;
            const majorityMargin = 50;
            return deployer.deploy(LendingBoard, minQuorum, minsForDebate, majorityMargin, Base.address);
        });
};
