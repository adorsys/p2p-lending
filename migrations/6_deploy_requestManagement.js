const RequestFactory = artifacts.require("RequestFactory");
const RequestManagement = artifacts.require("RequestManagement");

module.exports = async deployer => {
    const requestFactory = await RequestFactory.deployed();

    await deployer.deploy(RequestManagement, requestFactory.address);
};
