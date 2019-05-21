<template>
  <div class="createRequest">
    <div class="x-large">Create Request</div>
    <div class="createRequest__content">
      <NewRequest :contract="requestManagement" />
    </div>
  </div>
</template>

<script>
import NewRequest from '../components/RequestManagement/CreateRequest/NewRequest'
import { mapState } from 'vuex'
export default {
  name: 'CreateRequest',
  components: {
    NewRequest,
  },
  computed: mapState({
    requestManagement: (state) => state.requestManagementInstance,
  }),
}
</script>

<style lang="scss">
@import '../util/scss/_variables';
.createRequest {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.createRequest__content {
  padding: 2rem 0;
  display: grid;
  grid-template-columns: auto minmax(calc(60vw - 300px), calc(70vw - 300px)) auto;

  .newRequest {
    grid-column: 2;
  }
}
</style>
