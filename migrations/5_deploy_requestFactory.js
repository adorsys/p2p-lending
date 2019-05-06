const TrustToken = artifacts.require("TrustToken");
const ProposalManagement = artifacts.require("ProposalManagement");
const RequestFactory = artifacts.require("RequestFactory");

module.exports = async deployer => {
    const trustToken = await TrustToken.deployed();
    const proposalManagement = await ProposalManagement.deployed();

    await deployer.deploy(
        RequestFactory,
        trustToken.address,
        proposalManagement.address
    );
};
