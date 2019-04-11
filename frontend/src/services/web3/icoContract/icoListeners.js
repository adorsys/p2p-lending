import store from '@/store/'
import { UPDATE_ICO, UPDATE_REQUESTS } from '@/util/constants/types'

export const pollICO = (contract, requestManagement) => {
    participatedListener(contract)
    icoFinishedListener(contract)
    transferListener(contract, requestManagement)
}

const participatedListener = contract => {
    let txHash = null
    contract()
        .events.Participated()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                store.dispatch(UPDATE_ICO, contract)
            }
        })
}

const icoFinishedListener = contract => {
    let txHash = null
    contract()
        .events.ICOFinished()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                store.dispatch(UPDATE_ICO, contract)
            }
        })
}

const transferListener = (contract, requestManagement) => {
    let txHash = null
    contract()
        .events.Transfer()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                store.dispatch(UPDATE_ICO, contract)
                store.dispatch(UPDATE_REQUESTS, requestManagement)
            }
        })
}
