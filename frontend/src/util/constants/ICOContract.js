const config = require('../../../deployed-config')
const icoAddress = config.contracts.icoContract.address
const icoAbi = config.contracts.icoContract.abi

export { icoAddress, icoAbi }
