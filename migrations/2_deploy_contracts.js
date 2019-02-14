const LendingBoard = artifacts.require("./LendingBoard.sol");
const RequestManagement = artifacts.require(
    "./LendingRequests/RequestManagement.sol"
);
const ProposalFactory = artifacts.require(
    "./ProposalFactory/ProposalFactory.sol"
);
const ProposalManagement = artifacts.require(
    "./ProposalFactory/ProposalManagement.sol"
);

const minimumQuorum = 1;
const majorityMargin = 50;

module.exports = async deployer => {
    await deployer.deploy(LendingBoard, minimumQuorum, majorityMargin);
    await deployer.deploy(RequestManagement, LendingBoard.address);
    await deployer.deploy(ProposalFactory);
    await deployer.deploy(ProposalManagement);
};
