import {
    proposalManagementAddress,
    proposalManagementABI
} from '@/util/constants/proposalManagementContract'
import store from '@/store/'
import { INIT_PROPOSALMANAGEMENT } from '@/util/constants/types'

export const initializeProposalManagementHelper = async () => {
    let web3 = store.state.web3.web3Instance()
    let contract = await new web3.eth.Contract(
        proposalManagementABI,
        proposalManagementAddress
    )

    const payload = () => {
        return contract
    }

    return payload
}

export const initializeProposalManagement = async () => {
    store.dispatch(INIT_PROPOSALMANAGEMENT)
}
