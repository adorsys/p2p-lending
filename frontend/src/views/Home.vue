<template>
  <div class="home">
    <LandingPage title="p2p Lending" />
  </div>
</template>

<script>
import LandingPage from '@/components/LandingPage/landingpage'
export default {
  name: 'home',
  components: {
    LandingPage
  }
}
</script>

<style lang="scss">
.home {
  height: 92vh;
}
</style>
