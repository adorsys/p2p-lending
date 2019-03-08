<template>
  <div class="userRequest__management">
    <div class="subtitle subtitle--userRequest">User Requests</div>
    <table class="table" v-if="askerProposals.length !== 0">
      <thead>
        <tr>
          <th class="table__head">Asker</th>
          <th class="table__head">Amount Asked</th>
          <th class="table__head">Payback Amount</th>
          <th class="table__head">Status</th>
          <th class="table__head">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table__row" v-for="p in askerProposals" :key="p.idx">
          <td class="table__data">{{ p.author }}</td>
          <td class="table__data">{{ p.askAmount + ' ETH' }}</td>
          <td class="table__data">{{ p.paybackAmount + ' ETH' }}</td>
          <td class="table__data">{{ p.status }}</td>
          <td class="table__data table__data--buttons">
            <div
              v-on:click="withdraw(p.address)"
              class="button button--table button--userTable"
              v-if="p.status === 'Withdrawable'"
            >Withdraw</div>
            <div
              v-on:click="deposit(p.address, p.paybackAmount, p.contractFee)"
              class="button button--table button--userTable"
              v-if="p.status === 'Withdrawn'"
            >Deposit</div>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table" v-if="askerProposals.length === 0">
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
import { mapState } from 'vuex'
export default {
  computed: mapState({
    contract: state => state.requestManagementInstance
  }),
  data() {
    return {
      askerProposals: [],
      lenderProposals: []
    }
  },
  methods: {
    async withdraw(address) {
      await this.contract()
        .methods.withdraw(address)
        .send({ from: this.$store.state.web3.coinbase })
    },
    async deposit(address, payback, contractFee) {
      console.log(address, payback, contractFee)
      // await this.contract().methods.deposit(address).send({ value: })
    },
    async getRequests() {
      const user = this.$store.state.web3.coinbase
      try {
        this.askerProposals = []
        this.lenderProposals = []
        const userRequests = await this.contract()
          .methods.getRequests(user)
          .call()

        if (userRequests.length !== 0) {
          for (let i = 0; i < userRequests.length; i++) {
            const proposalParameters = await this.contract()
              .methods.getProposalParameters(userRequests[i])
              .call()
            const proposalState = await this.contract()
              .methods.getProposalState(userRequests[i])
              .call()
            console.log(proposalParameters)
            console.log(proposalState)
            const prop = {
              address: userRequests[i],
              author: proposalParameters.asker,
              askAmount: proposalParameters.askAmount / 10 ** 18,
              paybackAmount: proposalParameters.paybackAmount / 10 ** 18,
              purpose: proposalParameters.purpose,
              contractFee: proposalParameters.contractFee / 10 ** 3, // change fee representation in contract to wei
              status: 'Waiting'
            }
            if (proposalState.withdrawnByAsker) {
              prop.status = 'Withdrawn'
            }
            if (proposalState.lent && !proposalState.withdrawnByAsker) {
              prop.status = 'Withdrawable'
            }
            if (
              String(user).toUpperCase() ===
              proposalParameters.asker.toUpperCase()
            ) {
              if (!proposalState.debtSettled) {
                this.askerProposals.push(prop)
              }
            } else {
              this.lenderProposals.push(prop)
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
        if (contractInstance !== null && contractInstance !== undefined) {
          // requestManagement was initialized -> get all open lending requests
          this.getRequests()

          // start event listeners for request management
          // this.requestCreatedListener()
          // this.depositListener()

          // reload requests on account change
          // eslint-disable-next-line no-undef
          ethereum.on('accountsChanged', () => {
            this.getRequests()
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import './userLendingRequests';
</style>
