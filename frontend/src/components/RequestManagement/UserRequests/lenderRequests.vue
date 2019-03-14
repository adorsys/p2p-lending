<template>
  <div class="lenderRequest__management">
    <div class="subtitle subtitle--lenderRequest">Lender For</div>
    <table class="table" v-if="lenderRequests.length !== 0">
      <thead>
        <tr>
          <th class="table__head">Asker</th>
          <th class="table__head">Amount Asked</th>
          <th class="table__head">Payback Amount</th>
          <th class="table__head">Description</th>
          <th class="table__head">Status</th>
          <th class="table__head">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table__row" v-for="p in lenderRequests" :key="p.idx">
          <td class="table__data">{{ p.asker }}</td>
          <td class="table__data">{{ p.askAmount + ' ETH' }}</td>
          <td class="table__data">{{ p.paybackAmount + ' ETH' }}</td>
          <td class="table__data">{{ p.purpose }}</td>
          <td class="table__data">{{ p.status }}</td>
          <td class="table__data table__data--buttons">
            <div
              v-on:click="withdraw(p.address)"
              class="button button--table button--lenderTable"
              v-if="p.status === 'PaidBack' || p.status === 'Withdrawable'"
            >Withdraw</div>
            <span v-if="p.status !== 'PaidBack' && p.status !== 'Withdrawable'">n/a</span>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table" v-if="lenderRequests.length === 0">
      <thead>
        <tr class="table__row">
          <th class="table__head">Lender</th>
        </tr>
      </thead>
      <tbody>
        <td class="table__data">No Requests Found</td>
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
      lenderRequests: []
    }
  },
  methods: {
    async getLenderRequests() {
      this.lenderRequests = []
      const account = await this.$store.state.web3
        .web3Instance()
        .eth.getCoinbase()
      this.allRequests.forEach(element => {
        if (
          String(account).toUpperCase() === String(element.lender).toUpperCase()
        ) {
          this.lenderRequests.push(element)
        }
      })
    },
    async withdraw(address) {
      await this.contract()
        .methods.withdraw(address)
        .send({ from: this.$store.state.web3.coinbase })
    }
  },
  watch: {
    allRequests: {
      handler: function() {
        this.getLenderRequests()
      }
    }
  },
  mounted() {
    if (this.allRequests.length !== 0 && this.contract !== null) {
      this.getLenderRequests()
    }
  }
}
</script>

<style lang="scss">
@import './lenderRequests.scss';
</style>
