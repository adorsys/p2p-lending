<template>
  <div class="landingPage" v-if="active">
    <div class="x-large">p2p-Lending</div>
    <p class="lead">
      p2p-Lending is a decentralized lending platform that tries to solve the
      following problems in the blockchain space:
    </p>
    <ul class="landingPage__problems">
      <li class="landingPage__problem bulletpoint">Proof of Identity</li>
      <li class="landingPage__problem bulletpoint"
        >Decentralized Management (DAO)</li
      >
      <li class="landingPage__problem bulletpoint">
        <p class="bulletpoint">Incentivization and continous use of a</p>
        <p class="bulletpoint">DAO ecosystem</p>
      </li>
    </ul>
    <p class="lead">
      Invest and participate in the ecosystem
      <router-link :to="{ name: 'ico' }" class="landingPage__invest"
        >here</router-link
      >
    </p>
  </div>
  <div class="landingPage" v-else>
    <div class="x-large">p2p Lending</div>
    <p class="lead">
      Request or lend Ether in a decentralized ecosystem that tries to solve
      several problems in the blockchain space.
    </p>
    <div class="landingPage__buttons">
      <router-link :to="{ name: 'lendingRequests' }" class="btn btn--light"
        >All Request</router-link
      >
      <router-link :to="{ name: 'createRequest' }" class="btn btn--light"
        >Place Request</router-link
      >
      <router-link :to="{ name: 'userRequests' }" class="btn btn--light"
        >Your Request</router-link
      >
    </div>
    <div class="btn btn--light" @click="test">Test</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ProposalManagementService } from '../../services/proposalManagement/ProposalManagementService'
export default {
  name: 'LandingPage',
  computed: {
    ...mapState('ico', ['active']),
    ...mapState('proposalManagement', ['proposals']),
  },
  methods: {
    async test() {
      console.log(await ProposalManagementService.getProposals())
      console.log(this.proposals[0])
    },
  },
}
</script>

<style lang="scss">
@import './LandingPage';
</style>
