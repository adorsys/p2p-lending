<template>
  <div class="home">
    <div class="title">p2p Lending</div>
    <div class="subtitle subtitle--landingpage">
      A decentralised lending platform
    </div>
    <hr class="separator" />
    <div class="subtitle">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat rem
      dolorem, sequi quisquam odio nisi possimus dolore tenetur molestias cumque
      repudiandae, dignissimos ratione labore quo doloribus explicabo culpa
      cupiditate ab?
    </div>
    <hr class="separator" />
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
  height: 100%;
}

.subtitle--landingpage {
  text-decoration: none;
  font-size: 2rem;
}
</style>
