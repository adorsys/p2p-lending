import store from '@/store/'

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

        if (parseInt(proposal.fnNumber, 10) === 1) {
            _description = 'Add member '
            _description = _description.concat(proposal.memberAddress)
        } else if (parseInt(proposal.fnNumber, 10) === 2) {
            _description = 'Remove member '
            _description = _description.concat(proposal.memberAddress)
        } else {
            _description = _description.concat(
                proposal.proposedFee / 1000 + ' ETH'
            )
        }

        let newProposal = {
            author: proposal.author,
            description: _description,
            id: i,
            executed: proposal.executed,
            agrees: false
        }

        proposals.push(newProposal)
    }

    return proposals
}

export default getOpenProposals
