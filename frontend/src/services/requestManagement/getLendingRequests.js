export const requestHelper = async contract => {
    let requests = []

    const openRequests = await contract()
        .methods.getRequests(contract()._address)
        .call()

    if (openRequests.length !== 0) {
        for (let i = 0; i < openRequests.length; i++) {
            const proposalParameters = await contract()
                .methods.getProposalParameters(openRequests[i])
                .call()

            const proposalState = await contract()
                .methods.getProposalState(openRequests[i])
                .call()

            const capitalizedPurpose =
                proposalParameters.purpose.charAt(0).toUpperCase() +
                proposalParameters.purpose.slice(1)

            const paybackAmount =
                proposalParameters.paybackAmount / 10 ** 18 +
                proposalParameters.contractFee / 10 ** 18

            const prop = {
                address: openRequests[i],
                asker: proposalParameters.asker,
                lender: proposalParameters.lender,
                askAmount: proposalParameters.askAmount / 10 ** 18,
                paybackAmount: paybackAmount,
                contractFee: proposalParameters.contractFee / 10 ** 18,
                purpose: capitalizedPurpose,
                verifiedAsker: proposalState.verifiedAsker,
                lent: proposalState.lent,
                withdrawnByAsker: proposalState.withdrawnByAsker,
                debtSettled: proposalState.debtSettled,
                status: 'Waiting'
            }
            if (prop.lent) {
                prop.status = 'Ether Lent'
            }
            if (prop.withdrawnByAsker) {
                prop.status = 'Withdrawn'
            }
            if (prop.debtSettled) {
                prop.status = 'PaidBack'
            }
            requests.push(prop)
        }
    }
    return requests
}
