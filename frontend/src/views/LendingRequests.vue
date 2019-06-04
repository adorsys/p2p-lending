<template>
  <div class="lendingRequests">
    <div class="x-large">LendingRequests</div>
    <section class="lendingRequests__content">
      <OpenRequests />
    </section>
  </div>
</template>

<script>
import OpenRequests from '../components/RequestManagement/LendingRequests/OpenRequests'
export default {
  components: {
    OpenRequests,
  },
}
</script>

<style lang="scss">
.lendingRequests {
  height: 100%;
  display: grid;
  grid-template-rows: 150px auto;
  align-items: center;

  &__content {
    grid-row: 2;
    height: 100%;
    padding-top: 2rem;
  }
}
</style>
