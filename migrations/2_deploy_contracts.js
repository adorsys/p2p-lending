const LendingBoard = artifacts.require("./LendingBoard.sol");
const RequestManagement = artifacts.require(
    "./LendingRequests/RequestManagement.sol"
);
const ProposalManagement = artifacts.require(
    "./ProposalFactory/ProposalManagement.sol"
);

const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '..', 'frontend', 'deployed-config.json');

const minimumQuorum = 1;
const majorityMargin = 50;

module.exports = async deployer => {
    await generateContractDeploymentConfig();
    await deployer.deploy(LendingBoard, minimumQuorum, majorityMargin);

    await writeContractInfo('lendingboard', LendingBoard.abi, LendingBoard.address);

    await deployer.deploy(RequestManagement, LendingBoard.address);
    await deployer.deploy(ProposalManagement);
};

function generateContractDeploymentConfig() {
    const config = {contracts:{}};
    return new Promise(resolve => {
        fs.writeFile(configPath, JSON.stringify(config), 'utf8', (err, data) => resolve());
    });
}

function writeContractInfo(contract, abi, address) {
    return new Promise((resolve, reject) => {
        fs.readFile(configPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                obj = JSON.parse(data);
                obj.contracts[contract] = {
                    abi,
                    address
                };
                fs.writeFile(configPath, JSON.stringify(obj), 'utf8', () => resolve());
            }
        });
    });
}
