var Migrations = artifacts.require("./Migrations.sol");
var Base = artifacts.require("./Base.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Base);
};
