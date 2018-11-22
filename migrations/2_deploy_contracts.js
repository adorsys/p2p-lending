var Base = artifacts.require("./Base.sol");
var LendingBoard = artifacts.require("./Lending_board.sol");

module.exports = function (deployer) {
    deployer.deploy(Base)
        .then(function () {
            var minQuorum = 1;
            var minsForDebate = 0;
            var majorityMargin = 50;
            return deployer.deploy(LendingBoard, minQuorum, minsForDebate, majorityMargin, Base.address);
        });
};
