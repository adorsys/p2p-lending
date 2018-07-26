const path = require('path');
const fs = require('fs');
const solc = require('solc');

const baseContractPath = path.resolve(__dirname, 'contracts', 'Base.sol');
const source = fs.readFileSync(baseContractPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Base'];
