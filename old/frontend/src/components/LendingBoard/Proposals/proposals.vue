<template>
  <div>
    <div class="subtitle">Open Proposals:</div>
    <div class="proposals">
      <table class="table" v-if="proposals.length !== 0">
        <thead>
          <tr>
            <th class="table__head">Author</th>
            <th class="table__head">Description</th>
            <th class="table__head">Vote</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in proposals" :key="p.idx">
            <td class="table__data">{{p.author}}</td>
            <td class="table__data">{{p.description}}</td>
            <td class="table__data table__data--buttons">
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
      <table class="table" v-if="proposals.length === 0">
        <thead>
          <tr>
            <th class="table__head">Proposals</th>
          </tr>
        </thead>
        <tbody>
          <td class="table__data">No Proposals found</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    contract: state => state.proposalManagementInstance,
    proposals: state => state.proposals
  }),
  methods: {
    async vote(stance, address) {
      const account = this.$store.state.web3.coinbase
      await this.contract()
        .methods.vote(stance, address, account)
        .send({ from: this.$store.state.web3.coinbase })
    }
  },
  watch: {
    contract: {
      handler: function() {
        console.log('refresh proposals')
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/components/LendingBoard/Proposals/proposals.scss';
</style>
