const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { interface, bytecode } = require("./compile");
const INFURA_API_KEY = "...";

const provider = new HDWalletProvider(
  'word word word word',
  'https://ropsten.infura.io/v3/${INFURA_API_KEY}' // check out infura.io
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Attempting to deploy from ${accounts[0]}`)

  const contract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: '0x' + bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  console.log(`Contract deployed to ${contract.options.address}`);
  console.log(`With interface ${interface}`);
};

deploy();
