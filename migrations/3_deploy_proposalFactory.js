const ProposalFactory = artifacts.require("ProposalFactory");

module.exports = deployer => {
    deployer.deploy(ProposalFactory);
};
