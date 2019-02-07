<template>
  <div>
    <hr>
    <table v-if="proposals.length !== 0">
      <thead>
        <tr>
          <th>Author</th>
          <th>Description</th>
          <th>In Favor</th>
          <th id="vote">Vote</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in proposals" :key="p.idx">
          <td>{{p.author}}</td>
          <td>{{p.description}}</td>
          <td id="stance">
            <label>
              <input type="checkbox" :value="true" v-model="p.agrees">
            </label>
          </td>
          <td id="vote">
            <button v-on:click="vote(p.id, p.agrees)" id="voteButton">Vote</button>
          </td>
        </tr>
      </tbody>
    </table>
    <table v-if="proposals.length === 0">
      <thead>
        <tr>
          <th id="emptyPropHead">Proposals</th>
        </tr>
      </thead>
      <tbody>
        <td id="emptyPropCont">No Proposals loaded - Refresh</td>
      </tbody>
    </table>
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

<style lang="scss" scoped>
@import '@/components/LendingBoard/Proposals/proposals.scss';
</style>
