<template>
  <div class="landingPage" v-if="active">
    <div class="card card--threeRows">
      <div class="card__title-section">
        <div class="title">p2p Lending</div>
        <div class="subtitle">
          Invest in a decentralized platform tackling the following problems:
        </div>
      </div>
      <ul class="landingPage__bulletpoints">
        <li class="landingPage__bulletpoint">Proof of Identity</li>
        <li class="landingPage__bulletpoint">Decentralized Management (DAO)</li>
        <li class="landingPage__bulletpoint"
          >Incentivization and continous use of a DAO</li
        >
      </ul>
      <router-link :to="{ name: 'ico' }" class="btn landingPage__button"
        >Start now</router-link
      >
    </div>
  </div>
  <div class="landingPage" v-else>
    <div class="card card--twoRows">
      <div class="card__title-section">
        <div class="title">Lending</div>
        <div class="subtitle"
          >If you want to apply for a loan or finance a loan, this way.</div
        >
      </div>
      <router-link :to="{ name: 'allRequests' }" class="btn"
        >Lending Area</router-link
      >
    </div>
    <div class="card card--twoRows">
      <div class="card__title-section">
        <div class="title">Management</div>
        <div class="subtitle">
          If you want to participate in the management of the DAO, this way.
        </div>
      </div>
      <router-link :to="{ name: 'ico' }" class="btn"
        >Management Area</router-link
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LandingPage',
  computed: {
    ...mapState('ico', ['active']),
  },
}
</script>

<style lang="scss">
@import 'LandingPage';
</style>
