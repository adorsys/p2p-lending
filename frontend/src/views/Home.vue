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
@import '../util/scss/variables';

.home {
  min-height: $content-height;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
