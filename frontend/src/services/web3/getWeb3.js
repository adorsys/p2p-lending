import Web3 from 'web3'

let getWeb3 = async () => {
    let web3 = null

    if (window.ethereum) {
        // eslint-disable-next-line no-undef
        web3 = new Web3(ethereum)
    } else if (typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider)
    } else {
        throw new Error('No web3 support detected')
    }

    // eslint-disable-next-line no-undef
    await ethereum.enable()

    return web3
}

export default getWeb3
