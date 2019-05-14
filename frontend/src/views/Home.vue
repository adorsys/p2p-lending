<template>
  <div class="home">
    <LandingPage />
  </div>
</template>

<script>
import LandingPage from '@/components/LandingPage/LandingPage'

export default {
  name: 'home',
  components: {
    LandingPage,
  },
}
</script>

<style lang="scss">
@import '../util/scss/_utilities';
</style>
