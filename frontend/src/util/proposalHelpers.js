import store from '@/store/'
import { INIT_PROPOSALS } from '@/util/constants/types'

async function openProposalsLength() {
    let length = await store.state
        .contractInstance()
        .methods.getOpenProposalsLength()
        .call()
    return length
}

function getProposalId(_idx) {
    let proposalId = new Promise(resolve => {
        resolve(
            store.state
                .contractInstance()
                .methods.openProposals(_idx)
                .call()
        )
    })
    return proposalId
}

function prepareIds(_length) {
    const results = []
    for (let i = 0; i < _length; i++) {
        results.push(getProposalId(i))
    }
    return Promise.all(results)
}

async function getOpenProposals() {
    const proposals = []

    let length = await openProposalsLength()
    let ids = await prepareIds(length)

    for (const i in ids) {
        let proposal = await store.state
            .contractInstance()
            .methods.proposals(ids[i])
            .call()

        let _description = 'Change fee to '

        if (parseInt(proposal[1], 10) === 1) {
            _description = 'Add member '
            _description = _description.concat(proposal[8])
        } else if (parseInt(proposal[1], 10) === 2) {
            _description = 'Remove member '
            _description = _description.concat(proposal[8])
        } else {
            _description = _description.concat(
                parseInt(proposal[7], 10) + ' wei'
            )
        }

        let date = new Date(parseInt(proposal[4], 10) * 1000)
        date = date.toLocaleString()

        let newProposal = {
            author: proposal[0],
            description: _description,
            executionDate: date,
            id: i,
            executed: proposal[6],
            agrees: false
        }

        proposals.push(newProposal)
    }

    return proposals
}

async function proposalInit() {
    store.dispatch(INIT_PROPOSALS)
}

export { getOpenProposals, proposalInit }
