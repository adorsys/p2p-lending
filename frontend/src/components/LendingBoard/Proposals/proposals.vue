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
              <div v-on:click="vote(p.id, true)" class="button button--table button--vote">Agree</div>
              <div v-on:click="vote(p.id, false)" class="button button--table button--vote">Disagree</div>
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
    proposals: state => state.proposals
  }),
  data() {
    return {}
  },
  methods: {
    async vote(idx, stance) {
      await this.$store.state
        .contractInstance()
        .methods.vote(idx, stance)
        .send({ from: this.$store.state.web3.coinbase })
    }
  }
}
</script>

<style lang="scss">
@import '@/components/LendingBoard/Proposals/proposals.scss';
</style>
