<template>
  <div class="home">
    <LandingPage />
  </div>
</template>

<script>
import LandingPage from '../components/LandingPage/LandingPage'
export default {
  name: 'home',
  components: {
    LandingPage,
  },
}
</script>

<style lang="scss">
.home {
  height: 100%;
  width: 100%;
}
</style>
