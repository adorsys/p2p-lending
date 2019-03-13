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
          <td class="table__data">{{ p.asker }}</td>
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
            <span v-if="p.status !== 'Withdrawn' && p.status !== 'Withdrawable'">n/a</span>
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
import { UPDATE_REQUESTS } from '@/util/constants/types'
export default {
  computed: mapState({
    contract: state => state.requestManagementInstance,
    allRequests: state => state.allRequests
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
      this.askerProposals = []
      const account = await this.$store.state.web3
        .web3Instance()
        .eth.getCoinbase()
      this.allRequests.forEach(element => {
        if (
          String(account).toUpperCase() === String(element.asker).toUpperCase()
        ) {
          this.askerProposals.push(element)
        }
      })
    }
  },
  watch: {
    contract: {
      handler: function(contractInstance) {
        if (contractInstance !== null && contractInstance !== undefined) {
          // requestManagement was initialized -> get all open lending requests
          this.$store.dispatch(UPDATE_REQUESTS, contractInstance)

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
    },
    allRequests: {
      handler: function() {
        console.log('allRequests changed')
        this.getRequests()
      }
    }
  }
}
</script>

<style lang="scss">
@import './userRequests';
</style>
