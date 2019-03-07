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
      <div class="subtitle">Open Lending Requests</div>
      <table class="table" v-if="proposals.length !== 0">
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
          <tr class="table__row" v-for="p in proposals" :key="p.idx">
            <td class="table__data">{{ p.author }}</td>
            <td class="table__data">{{ p.askAmount }}</td>
            <td class="table__data">{{ p.paybackAmount }}</td>
            <td class="table__data" v-if="p.trusted">
              <div class="table__data--trusted">Yes</div>
            </td>
            <td class="table__data" v-if="!p.trusted">
              <div class="table__data--untrusted">No</div>
            </td>
            <td class="table__data table__data--buttons">
              <div v-on:click="claim(p.address)" class="button button--table button--lend">Lend</div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table" v-if="proposals.length === 0">
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
      proposals: []
    }
  },
  props: ['contract'],
  methods: {
    claim(address) {
      console.log('lending : ' + address)
    },
    async getRequests(contract, contractAddress) {
      try {
        this.proposals = []
        const openRequests = await contract.methods
          .getRequests(contractAddress)
          .call({ from: this.$store.state.web3.coinbase })

        if (openRequests.length !== 0) {
          for (let i = 0; i < openRequests.length; i++) {
            const proposalParameters = await contract.methods
              .getProposalParameters(openRequests[i])
              .call()
            const prop = {
              author: proposalParameters.asker,
              askAmount: proposalParameters.askAmount + ' ETH',
              paybackAmount: proposalParameters.paybackAmount + ' ETH',
              trusted: false
            }
            this.proposals.push(prop)
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
        let contractAddress = contractInstance._address
        this.getRequests(contractInstance, contractAddress)
      }
    }
  }
}
</script>

<style lang="scss">
@import './lendingRequests';
</style>
