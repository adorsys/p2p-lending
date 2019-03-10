const LendingBoard = artifacts.require("LendingBoard");
const RequestManagement = artifacts.require("RequestManagement");
const ProposalFactory = artifacts.require("ProposalFactory");
const TrustToken = artifacts.require("TrustToken");
const ProposalManagement = artifacts.require("ProposalManagement");

const fs = require("fs");
const path = require("path");
const configPath = path.join(
    __dirname,
    "..",
    "frontend",
    "deployed-config.json"
);

const minimumQuorum = 1;
const majorityMargin = 50;

const tokenSupply = 1000;
const tokenName = "TrustToken";
const tokenDecimals = 18;
const tokenSymbol = "TT";

module.exports = async deployer => {
    await generateContractDeploymentConfig();
    await deployer.deploy(LendingBoard, minimumQuorum, majorityMargin);
    await deployer.deploy(
        TrustToken,
        tokenSupply,
        tokenName,
        tokenDecimals,
        tokenSymbol
    );

    await writeContractInfo("icocontract", TrustToken.abi, TrustToken.address);

    await writeContractInfo(
        "lendingboard",
        LendingBoard.abi,
        LendingBoard.address
    );

    await deployer.deploy(RequestManagement, TrustToken.address);

    // generate contract info for request management
    await writeContractInfo(
        "requestmanagement",
        RequestManagement.abi,
        RequestManagement.address
    );

    await deployer.deploy(ProposalFactory);
    await deployer.deploy(
        ProposalManagement,
        ProposalFactory.address,
        TrustToken.address
    );
};

function generateContractDeploymentConfig() {
    const config = { contracts: {} };
    return new Promise(resolve => {
        fs.writeFile(configPath, JSON.stringify(config), "utf8", (err, data) =>
            resolve()
        );
    });
}

function writeContractInfo(contract, abi, address) {
    return new Promise((resolve, reject) => {
        fs.readFile(configPath, "utf8", (err, data) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                obj = JSON.parse(data);
                obj.contracts[contract] = {
                    abi,
                    address
                };
                fs.writeFile(configPath, JSON.stringify(obj), "utf8", () =>
                    resolve()
                );
            }
        });
    });
}
