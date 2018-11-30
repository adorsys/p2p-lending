const Base = artifacts.require("./Base.sol");
const LendingBoard = artifacts.require("./LendingBoard.sol");

module.exports = function (deployer) {
    deployer.deploy(LendingBoard)
        .then(function() {
            return deployer.deploy(Base, LendingBoard.address);
        });
};
