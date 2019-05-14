<template>
  <div class="createRequest">
    <div class="x-large createRequest__title">Create Request</div>
    <NewRequest :contract="requestManagement" />
  </div>
</template>

<script>
import NewRequest from '@/components/RequestManagement/CreateRequest/NewRequest'
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
  width: 100%;
}
</style>
