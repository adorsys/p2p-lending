const Base = artifacts.require("./Base.sol");
const LendingBoard = artifacts.require("./LendingBoard.sol");

const minimumQuorum = 1;
const minutesForDebate = 30;
const majorityMargin = 50;

module.exports = function(deployer) {
    deployer.deploy(LendingBoard, minimumQuorum, minutesForDebate, majorityMargin).then(function() {
        return deployer.deploy(Base, LendingBoard.address);
    });
};
