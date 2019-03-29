<template>
  <div class="askerRequest__management">
    <div class="subtitle subtitle--askerRequest">Your Requests</div>
    <table class="table" v-if="askerRequests.length !== 0">
      <thead>
        <tr>
          <th class="table__head">Amount Asked</th>
          <th class="table__head">Payback Amount (includes Fees)</th>
          <th class="table__head">Description</th>
          <th class="table__head">Status</th>
          <th class="table__head">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table__row" v-for="p in askerRequests" :key="p.idx">
          <td class="table__data">{{ p.askAmount }} ETH</td>
          <td class="table__data table__data--payback">{{ p.paybackAmount }} ETH</td>
          <td class="table__data">{{ p.purpose }}</td>
          <td class="table__data table__data--status">{{ p.status }}</td>
          <td class="table__data table__data--buttons">
            <div
              v-on:click="cancel(p.address)"
              class="button button--table button--askerTable"
              v-if="p.status === 'Waiting'"
            >Cancel</div>
            <div
              v-on:click="withdraw(p.address)"
              class="button button--table button--askerTable"
              v-if="p.status === 'Ether Lent'"
            >Withdraw</div>
            <div
              v-on:click="deposit(p.address, p.paybackAmount)"
              class="button button--table button--askerTable"
              v-if="p.status === 'Withdrawn'"
            >Deposit</div>
            <span
              v-if="p.status !== 'Withdrawn' && p.status !== 'Ether Lent' && p.status !== 'Waiting'"
            >n/a</span>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table" v-if="askerRequests.length === 0">
      <thead>
        <tr class="table__row">
          <th class="table__head">Asker</th>
        </tr>
      </thead>
      <tbody>
        <td class="table__data table__data--empty">No Requests Found</td>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    allRequests: state => state.allRequests
  }),
  props: ['contract'],
  data() {
    return {
      askerRequests: [],
      requestGrantedListenerInstance: null,
      withdrawListenerInstance: null,
      debtPaidListenerInstance: null
    }
  },
  methods: {
    async withdraw(address) {
      await this.contract()
        .methods.withdraw(address)
        .send({ from: this.$store.state.web3.coinbase })
    },
    async deposit(address, payback) {
      const amountToSettle = this.$store.state.web3
        .web3Instance()
        .utils.toWei(String(payback), 'Ether')
      await this.contract()
        .methods.deposit(address)
        .send({ value: amountToSettle, from: this.$store.state.web3.coinbase })
    },
    async cancel(address) {
      await this.contract()
        .methods.cancelRequest(address)
        .send({ from: this.$store.state.web3.coinbase })
    },
    getAskerRequests() {
      this.askerRequests = []
      const account = this.$store.state.web3.coinbase
      this.allRequests.forEach(element => {
        if (
          String(account).toUpperCase() === String(element.asker).toUpperCase()
        ) {
          this.askerRequests.push(element)
        }
      })
    }
  },
  watch: {
    allRequests: {
      handler: function() {
        this.getAskerRequests()
      }
    }
  },
  mounted() {
    if (this.allRequests.length !== 0 && this.contract !== null) {
      this.getAskerRequests()
    }
  }
}
</script>

<style lang="scss">
@import './askerRequests';
</style>
