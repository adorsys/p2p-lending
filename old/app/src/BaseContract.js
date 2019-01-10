import web3 from './web3';

const address = '0x4494cc721B350221F374D09c43475a2610c1CAA4';

const abi = [
  {
    "constant": false,
    "inputs": [],
    "name": "settle",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "lendingRequests",
    "outputs": [
      {
        "name": "asker",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "paybackAmount",
        "type": "uint256"
      },
      {
        "name": "lender",
        "type": "address"
      },
      {
        "name": "settled",
        "type": "bool"
      },
      {
        "name": "purpose",
        "type": "string"
      },
      {
        "name": "lent",
        "type": "bool"
      },
      {
        "name": "creationTime",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "paybackAmount",
        "type": "uint256"
      },
      {
        "name": "purpose",
        "type": "string"
      }
    ],
    "name": "ask",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "asker",
        "type": "address"
      }
    ],
    "name": "lend",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  }
];

export default new web3.eth.Contract(abi, address);
