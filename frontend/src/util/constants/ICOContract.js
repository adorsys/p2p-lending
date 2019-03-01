const config = require('../../../deployed-config')
const icoAddress = config.contracts.icocontract.address
const icoAbi = config.contracts.icocontract.abi

export { icoAddress, icoAbi }