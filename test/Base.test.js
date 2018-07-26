const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require ('../compile');

let accounts;
let contract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  contract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Base Contract', () => {
  it('is deployed', () => {
      assert.ok(contract.options.address);
  });

  it('has a default message', async () => {
    const message = await contract.methods.message().call();
    assert.equal(message, 'Hi there!');
  });

  it('can change the message', async () => {
    await contract.methods.setMessage('ok').send({ from: accounts[0] });
    const message = await contract.methods.message().call();
    assert.equal(message, 'ok');
  });
});
