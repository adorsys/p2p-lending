// import store from '@/store/'

export const updateProposalHelper = async contract => {
    const proposals = await contract()
        .methods.getProposals()
        .call()

    const proposalParameters = []
    if (proposals.length !== 0) {
        // get proposal parameters for all found proposals in parallel
        await Promise.all(
            proposals.map(async element => {
                const prop = await contract()
                    .methods.getProposalParameters(element)
                    .call()
                proposalParameters.push(prop)
            })
        )
    }
    return proposalParameters
}
