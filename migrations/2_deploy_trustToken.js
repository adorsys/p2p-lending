const TrustToken = artifacts.require("TrustToken");

const tokenSupply = 1000;
const tokenName = "TrustToken";
const tokenDecimals = 18;
const tokenSymbol = "TT";

module.exports = deployer => {
    deployer.deploy(
        TrustToken,
        tokenSupply,
        tokenName,
        tokenDecimals,
        tokenSymbol
    );
};
