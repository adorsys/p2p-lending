<template>
  <div class="createRequest">
    <div class="x-large">Create Request</div>
    <section class="createRequest__content">
      <NewRequest />
    </section>
  </div>
</template>

<script>
import NewRequest from '../components/RequestManagement/CreateRequest/NewRequest'
export default {
  name: 'CreateRequest',
  components: {
    NewRequest,
  },
}
</script>

<style lang="scss">
@import '../util/scss/_variables';
.createRequest {
  height: 100%;
  display: grid;
  grid-template-rows: 150px auto;
  align-items: center;

  &__content {
    grid-row: 2;
    height: 100%;
    padding-top: 2rem;
    display: grid;
    grid-template-columns: auto 600px auto;

    .newRequest {
      grid-column: 2;
    }
  }
}
</style>
