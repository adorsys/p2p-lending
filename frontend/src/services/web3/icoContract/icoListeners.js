import store from '@/store/'
import { UPDATE_ICO_SALE, UPDATE_ICO_USER } from '@/util/constants/types'

export const pollICO = contract => {
    participatedListener(contract)
}

const participatedListener = contract => {
    let txHash = null
    contract()
        .events.Participated()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                store.dispatch(UPDATE_ICO_SALE, contract)

                if (
                    String(event.returnValues.buyer).toUpperCase() ===
                    String(store.state.web3.coinbase).toUpperCase()
                ) {
                    store.dispatch(UPDATE_ICO_USER, contract)
                }
            }
        })
}
