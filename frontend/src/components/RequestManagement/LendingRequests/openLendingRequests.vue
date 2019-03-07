<template>
  <div class="lendingRequestManagement">
    <div class="createLendingRequest">
      <div class="subtitle subtitle--lendingRequest">Create Lending Request</div>
      <div
        class="button button--lendingRequest"
        @click="$emit('openRequestOverlay')"
      >Create Lending Request</div>
      <div
        class="button button--lendingRequest"
        @click="getRequests(contract, contract._address)"
      >Get Lending Request</div>
      <slot/>
    </div>
    <hr class="separator">
    <div class="request__management">
      <div class="subtitle subtitle--lendingRequest">Open Lending Requests</div>
      <table class="table" v-if="allProposals.length !== 0">
        <thead>
          <tr>
            <th class="table__head">Asker</th>
            <th class="table__head">Amount Asked</th>
            <th class="table__head">Payback Amount</th>
            <th class="table__head">Trusted</th>
            <th class="table__head">Lend Money</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in allProposals" :key="p.idx">
            <td class="table__data">{{ p.author }}</td>
            <td class="table__data">{{ p.askAmount + ' ETH' }}</td>
            <td class="table__data">{{ p.paybackAmount + ' ETH' }}</td>
            <td class="table__data" v-if="p.trusted">
              <div class="table__data--trusted">Yes</div>
            </td>
            <td class="table__data" v-if="!p.trusted">
              <div class="table__data--untrusted">No</div>
            </td>
            <td class="table__data table__data--buttons">
              <div
                v-on:click="lend(p.address, p.askAmount)"
                class="button button--table button--lend"
              >Lend</div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table" v-if="allProposals.length === 0">
        <thead>
          <tr class="table__row">
            <th class="table__head">Lending Requests</th>
          </tr>
        </thead>
        <tbody>
          <td class="table__data">No Lending Requests Found</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allProposals: []
    }
  },
  props: {
    contract: Object,
    web3: Object
  },
  methods: {
    async lend(address, amount) {
      const lendAmount = this.web3.utils.toWei(String(amount), 'Ether')
      await this.contract.methods
        .deposit(address)
        .send({ value: lendAmount, from: this.web3.coinbase })
    },
    async getRequests(contract, contractAddress) {
      const account = await this.web3.eth.getCoinbase()
      try {
        this.allProposals = []
        const openRequests = await contract.methods
          .getRequests(contractAddress)
          .call({ from: account })
        if (openRequests.length !== 0) {
          for (let i = 0; i < openRequests.length; i++) {
            const proposalParameters = await contract.methods
              .getProposalParameters(openRequests[i])
              .call()
            if (
              String(account).toUpperCase() !==
              proposalParameters.asker.toUpperCase()
            ) {
              const prop = {
                address: openRequests[i],
                author: proposalParameters.asker,
                askAmount: proposalParameters.askAmount / 10 ** 18,
                paybackAmount: proposalParameters.paybackAmount / 10 ** 18,
                trusted: false,
                lent: proposalParameters.lent
              }
              if (prop.lent === false) {
                this.allProposals.push(prop)
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  watch: {
    contract: {
      handler: function(contractInstance) {
        const contractAddress = contractInstance._address
        this.getRequests(contractInstance, contractAddress)
        // eslint-disable-next-line no-undef
        ethereum.on('accountsChanged', () => {
          this.getRequests(this.contract, this.contract._address)
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import './openLendingRequests';
</style>
