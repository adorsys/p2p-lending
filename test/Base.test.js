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
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Base Contract', () => {
  it('is deployed', () => {
      assert.ok(contract.options.address);
  });

  it('has no contracts for an address', async () => {
    const lendingRequest = await contract.methods.lendingRequests(accounts[0]).call();
    assert.equal(lendingRequest.amount, 0);
  });

  it('can create lendingRequest', async () => {
    const deployed = await contract.methods.ask(500, 1510, "Glühalm").send({from: accounts[0], gas: '1000000'});
    assert.notEqual(deployed, null);

    const lendingRequest = await contract.methods.lendingRequests(accounts[0]).call();
    assert.equal(lendingRequest.amount, 500);
    assert.equal(lendingRequest.paybackAmount, 1510);
    assert.equal(lendingRequest.asker, accounts[0]);
  });

  it("can't lend wrong amount", async () => {
    await contract.methods.ask(500, 1510, "Glühalm").send({from: accounts[0], gas: '1000000'});

    const lentCalled = await contract.methods.lend(accounts[0]).send({from: accounts[1], gas: '1000000', value: 500});
    assert.notEqual(lent, lentCalled);

    const lendingRequest = await contract.methods.lendingRequests(accounts[0]).call();
    assert.equal(lendingRequest.lent, true);
  });
});
