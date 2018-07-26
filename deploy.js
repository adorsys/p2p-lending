const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = "./compile";

const provider = new HDWalletProvider(
  'Passphrase',
  'https://node-url' // check out infura.io
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Attempting to deploy from ${accounts[0]}`)

  const resultAddress = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!']})
    .send({ gas: '1000000', from: accounts[0] });

  console.log(`Contract deployed to ${address}`);
};

deploy();
