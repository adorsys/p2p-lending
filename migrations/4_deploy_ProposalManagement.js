const TrustToken = artifacts.require("TrustToken");
const ProposalFactory = artifacts.require("ProposalFactory");
const ProposalManagement = artifacts.require("ProposalManagement");

module.exports = async deployer => {
    const trustToken = await TrustToken.deployed();
    const proposalFactory = await ProposalFactory.deployed();

    await deployer.deploy(
        ProposalManagement,
        proposalFactory.address,
        trustToken.address
    );
};
