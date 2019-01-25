<template>
  <div>
    <hr>
    <table v-if="proposals.length !== 0" id="Open Proposals">
      <thead>
        <tr>
          <th>Author</th>
          <th>Description</th>
          <th>Execution Date</th>
          <th>In Favor</th>
          <th id="vote">Vote</th>
          <th id="execute">Execute</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in proposals" :key="p.idx">
          <td>{{p.author}}</td>
          <td>{{p.description}}</td>
          <td>{{p.executionDate}}</td>
          <td id="stance">
            <label>
              <input type="checkbox" :value="true" v-model="p.agrees">
            </label>
          </td>
          <td id="vote">
            <button v-on:click="vote(p.id, p.agrees)" id="voteButton">Vote</button>
          </td>
          <td id="execute">
            <button v-on:click="execute(p.id)" id="executeButton">Execute</button>
          </td>
        </tr>
      </tbody>
    </table>
    <table v-if="proposals.length === 0" id="No Proposals">
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
      console.log(idx, stance)
      await this.$store.state
        .contractInstance()
        .methods.vote(idx, stance)
        .send({ from: this.$store.state.web3.coinbase })
    },
    async execute(idx) {
      console.log('execute')
      await this.$store.state
        .contractInstance()
        .methods.executeProposal(idx)
        .send({ from: this.$store.state.web3.coinbase })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/components/LendingBoard/proposals.scss';
</style>
