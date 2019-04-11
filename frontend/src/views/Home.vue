<template>
  <div class="home">
    <div class="title">p2p Lending</div>
    <div class="subtitle subtitle--landingpage">
      A decentralised lending platform
    </div>
    <LandingPage />
  </div>
</template>

<script>
import LandingPage from '@/components/LandingPage/landingpage'
export default {
  components: {
    LandingPage
  }
}
</script>

<style lang="scss">
.home {
  height: calc(100vh - 51px);
}

.subtitle--landingpage {
  text-decoration: none;
  font-size: 2rem;
}
</style>
