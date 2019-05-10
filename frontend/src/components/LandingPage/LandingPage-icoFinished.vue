<template>
  <div class="landingPage">
    <div class="x-large">p2p Lending</div>
    <p class="lead">
      Invest in a decentralized ecosystem that tries to solve several problems
      in the blockchain space, place requests for Ether or lend Ether to other
      users
    </p>
    <div class="landingPage__buttons">
      <router-link :to="{ name: 'userrequests' }" class="btn btn--light"
        >Request</router-link
      >
      <router-link :to="{ name: 'lendingrequests' }" class="btn btn--light"
        >Invest</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage-icoFinished'
}
</script>

<style lang="scss">
@import './LandingPage-icoFinished';
</style>
