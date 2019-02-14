<template>
  <div>
    <hr>
    <table v-if="proposals.length !== 0">
      <thead>
        <tr>
          <th>Author</th>
          <th>Description</th>
          <th>In Favor</th>
          <th class="proposal-vote">Vote</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in proposals" :key="p.idx">
          <td>{{p.author}}</td>
          <td>{{p.description}}</td>
          <td class="proposal-stance">
            <label>
              <input type="checkbox" :value="true" v-model="p.agrees">
            </label>
          </td>
          <td class="proposal-vote">
            <button v-on:click="vote(p.id, p.agrees)" class="proposals-vote-button">Vote</button>
          </td>
        </tr>
      </tbody>
    </table>
    <table v-if="proposals.length === 0">
      <thead>
        <tr>
          <th class="proposals-empty">Proposals</th>
        </tr>
      </thead>
      <tbody>
        <td class="proposals-empty">No Proposals found</td>
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
