<template>
  <div>
    <div class="subtitle">Contract Fee Proposals</div>
    <div class="proposals">
      <table class="table table--feeProposals" v-if="feeProposals.length !== 0">
        <thead>
          <tr>
            <th class="table__head">Description</th>
            <th class="table__head">Cast Vote</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in feeProposals" :key="p.idx">
            <td class="table__data table__data--feeProposals">{{p.description}}</td>
            <td class="table__data table__data--feeProposals table__data--buttons">
              <div
                v-on:click="vote(true, p.address)"
                class="button button--table button--vote"
              >Agree</div>
              <div
                v-on:click="vote(false, p.address)"
                class="button button--table button--vote"
              >Disagree</div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table table--feeProposals" v-if="feeProposals.length === 0">
        <thead>
          <tr>
            <th class="table__head">Contract Fee Proposals</th>
          </tr>
        </thead>
        <tbody>
          <td class="table__data">No Contract Fee Proposals found</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    proposals: state => state.proposals
  }),
  props: ['contract'],
  data() {
    return {
      feeProposals: []
    }
  },
  methods: {
    filterFeeProposals(proposals) {
      if (proposals) {
        this.feeProposals = []
        proposals.forEach(element => {
          if (parseInt(element.propType, 10) === 1) {
            const fee = element.proposalFee / 10 ** 18
            const description = 'Change Contract Fee to ' + fee + ' ETH'

            const proposal = {
              address: element.proposalAddress,
              description: description
            }

            this.feeProposals.push(proposal)
          }
        })
      }
    },
    async vote(stance, proposalAddress) {
      await this.contract()
        .methods.vote(stance, proposalAddress, this.$store.state.web3.coinbase)
        .send({ from: this.$store.state.web3.coinbase })
    }
  },
  watch: {
    proposals: {
      handler: function(contractFeeProposals) {
        this.filterFeeProposals(contractFeeProposals)
      }
    }
  }
}
</script>

<style lang="scss">
@import './contractFeeProposals';
</style>
