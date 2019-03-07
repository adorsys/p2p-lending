<template>
  <div class="userRequest__management">
    <div class="subtitle subtitle--userRequest">User Requests</div>
    <table class="table" v-if="userProposals.length !== 0">
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
        <tr class="table__row" v-for="p in userProposals" :key="p.idx">
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
    <table class="table" v-if="userProposals.length === 0">
      <thead>
        <tr class="table__row">
          <th class="table__head">User Requests</th>
        </tr>
      </thead>
      <tbody>
        <td class="table__data">No Lending Requests Found</td>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userProposals: []
    }
  },
  props: {
    contract: Object,
    web3: Object,
    account: Object
  },
  methods: {
    async getRequests(contract) {
      const user = this.account
      try {
        this.userProposals = []
        const userRequests = await contract.methods.getRequests(user).call()

        if (userRequests.length !== 0) {
          for (let i = 0; i < userRequests.length; i++) {
            const proposalParameters = await contract.methods
              .getProposalParameters(userRequests[i])
              .call()
            console.log(proposalParameters)
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
        this.getRequests(contractInstance)
      }
    }
  }
}
</script>

<style lang="scss">
@import './userLendingRequests';
</style>
