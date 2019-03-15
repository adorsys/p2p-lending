<template>
  <div>
    <div class="subtitle">Member Proposals</div>
    <div class="proposals">
      <table class="table table--memberProposals" v-if="memberProposals.length !== 0">
        <thead>
          <tr>
            <th class="table__head">Description</th>
            <th class="table__head">Cast Vote</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in memberProposals" :key="p.idx">
            <td class="table__data table__data--memberProposals">{{p.description}}</td>
            <td class="table__data table__data--memberProposals table__data--buttons">
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
      <table class="table table--memberProposals" v-if="memberProposals.length === 0">
        <thead>
          <tr>
            <th class="table__head">Member Proposals</th>
          </tr>
        </thead>
        <tbody>
          <td class="table__data">No Member Proposals found</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    allProposals: state => state.proposals
  }),
  props: ['contract'],
  data() {
    return {
      memberProposals: []
    }
  },
  methods: {
    filterProposals(proposals) {
      if (proposals) {
        this.memberProposals = []
        proposals.forEach(element => {
          const proposalType = parseInt(element.propType, 10)
          if (proposalType === 2 || proposalType === 3) {
            let description = 'Add Member: ' + element.memberAddress
            if (proposalType === 3) {
              description = 'Remove Member: ' + element.memberAddress
            }

            const proposal = {
              address: element.proposalAddress,
              description: description
            }

            this.memberProposals.push(proposal)
          }
        })
      }
    },
    async vote(stance, proposalAddress) {
      await this.contract()
        .methods.vote(stance, proposalAddress)
        .send({ from: this.$store.state.web3.coinbase })
    }
  },
  watch: {
    allProposals: {
      handler: function(proposals) {
        this.filterProposals(proposals)
      }
    }
  }
}
</script>

<style lang="scss">
@import './memberProposals';
</style>
