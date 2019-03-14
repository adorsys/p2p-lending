<template>
  <div class="lendingRequestManagement">
    <div class="createLendingRequest">
      <div class="subtitle subtitle--lendingRequest">Create Lending Request</div>
      <div
        class="button button--lendingRequest"
        @click="$emit('openRequestOverlay')"
      >Create Lending Request</div>
      <slot/>
    </div>
    <hr class="separator">
    <div class="request__management">
      <div class="subtitle subtitle--lendingRequest">Open Lending Requests</div>
      <table class="table" v-if="openRequests.length !== 0">
        <thead>
          <tr>
            <th class="table__head">Asker</th>
            <th class="table__head">Amount Asked</th>
            <th class="table__head">Payback Amount</th>
            <th class="table__head">Purpose</th>
            <th class="table__head">Trusted</th>
            <th class="table__head">Lend Money</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in openRequests" :key="p.idx">
            <td class="table__data">{{ p.asker }}</td>
            <td class="table__data">{{ p.askAmount + ' ETH' }}</td>
            <td class="table__data">{{ p.paybackAmount + ' ETH' }}</td>
            <td class="table__data">{{ p.purpose }}</td>
            <td class="table__data" v-if="p.verifiedAsker">
              <div class="table__data--trusted">Yes</div>
            </td>
            <td class="table__data" v-if="!p.verifiedAsker">
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
      <table class="table" v-if="openRequests.length === 0">
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
import { mapState } from 'vuex'

export default {
  computed: mapState({
    allRequests: state => state.allRequests
  }),
  props: ['contract'],
  data() {
    return {
      openRequests: [],
      requestGrantedListenerInstance: null,
      requestCreatedListenerInstance: null
    }
  },
  methods: {
    async lend(address, amount) {
      const lendAmount = this.$store.state.web3
        .web3Instance()
        .utils.toWei(String(amount), 'Ether')
      await this.contract()
        .methods.deposit(address)
        .send({ value: lendAmount, from: this.$store.state.web3.coinbase })
    },
    async getRequests() {
      this.openRequests = []
      const account = await this.$store.state.web3
        .web3Instance()
        .eth.getCoinbase()
      this.allRequests.forEach(element => {
        if (
          String(account).toUpperCase() !== String(element.asker).toUpperCase()
        ) {
          if (element.lent === false) {
            this.openRequests.push(element)
          }
        }
      })
    }
  },
  watch: {
    allRequests: {
      handler: function() {
        this.getRequests()
      }
    }
  },
  mounted() {
    if (this.allRequests.length !== 0 && this.contract !== null) {
      this.getRequests()
    }
  }
}
</script>

<style lang="scss">
@import './openLendingRequests';
</style>
