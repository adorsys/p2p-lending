<template>
  <div class="lendingRequestManagement">
    <div class="createLendingRequest">
      <div class="subtitle subtitle--lendingRequest">Create Lending Request</div>
      <div
        class="button button--lendingRequest"
        @click="$emit('openRequestOverlay')"
      >Create Lending Request</div>
      <div class="button button--lendingRequest" @click="getRequests">Get Lending Request</div>
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
  methods: {
    claim(address) {
      console.log('lending : ' + address)
    },
    async getRequests() {
      // TODO: implement functionality to check if address has lending requests to query

      let contractAddress = this.$parent.requestManagementContract()._address

      try {
        let openRequests = await this.$parent
          .requestManagementContract()
          .methods.getRequests(contractAddress)
          .call({ from: this.$store.state.web3.coinbase })

        if (openRequests.length !== 0) {
          let proposalParameters = await this.$parent
            .requestManagementContract()
            .methods.getProposalParameters(openRequests[0])
            .call({ from: this.$store.state.web3.coinbase })

          this.proposals = [
            {
              author: proposalParameters.asker,
              askAmount: proposalParameters.askAmount + ' ETH',
              paybackAmount: proposalParameters.paybackAmount + ' ETH',
              trusted: false
            }
          ]
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.$on('lendingRequestCreated', () => {
      console.log('creation logged')
    })
  }
}
</script>

<style lang="scss">
@import './lendingRequests';
</style>
