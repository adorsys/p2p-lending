import store from '@/store/'

import { UPDATE_REQUESTS } from '@/util/constants/types'

export const pollRequestManagement = async contract => {
    accountChanged(contract)
    networkChanged(contract)
    requestCreatedListener(contract)
    requestGrantedListener(contract)
    withdrawListener(contract)
    debtPaidListener(contract)
}

const requestCreatedListener = contract => {
    let txHash = null
    contract()
        .events.RequestCreated()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                console.log(txHash)
                store.dispatch(UPDATE_REQUESTS, contract)
            }
        })
}

const requestGrantedListener = contract => {
    let txHash = null
    contract()
        .events.RequestGranted()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                console.log(txHash)
                store.dispatch(UPDATE_REQUESTS, contract)
            }
        })
}

const withdrawListener = contract => {
    let txHash = null
    contract()
        .events.Withdraw()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                console.log(txHash)
                store.dispatch(UPDATE_REQUESTS, contract)
            }
        })
}

const debtPaidListener = contract => {
    let txHash = null
    contract()
        .events.DebtPaid()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                console.log(txHash)
                store.dispatch(UPDATE_REQUESTS, contract)
            }
        })
}

const accountChanged = contract => {
    // eslint-disable-next-line no-undef
    ethereum.on('accountsChanged', () => {
        store.dispatch(UPDATE_REQUESTS, contract)
    })
}

const networkChanged = contract => {
    // eslint-disable-next-line no-undef
    ethereum.on('networkChanged', () => {
        store.dispatch(UPDATE_REQUESTS, contract)
    })
}
