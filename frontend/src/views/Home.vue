<template>
  <div class="home">
    <section class="landingPage">
      <div class="dark-overlay">
        <LandingPageFinished v-if="!icoActive" />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LandingPageFinished from '@/components/LandingPage/LandingPage-icoFinished'

export default {
  name: 'home',
  computed: mapState({
    icoActive: state => state.icoState.isIcoActive
  }),
  components: {
    LandingPageFinished
  }
}
</script>

<style lang="scss">
@import '../util/scss/_utilities';
.home {
  height: 100vh;
  background: url('../assets/ethereum-bg.jpg') no-repeat center center/cover;
}
.landingPage {
  padding-top: 6vh;
}
</style>
