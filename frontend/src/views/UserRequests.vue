<template>
  <div class="userRequests">
    <div class="x-large">User Requests</div>
    <hr class="separator" />
    <hr class="separator" />
    <AskerRequests :contract="requestManagementContract" />
    <hr class="separator" />
    <LenderRequests :contract="requestManagementContract" />
  </div>
</template>

<script>
import AskerRequests from '../components/RequestManagement/UserRequests/askerRequests'
import LenderRequests from '../components/RequestManagement/UserRequests/lenderRequests'

import { mapState } from 'vuex'

export default {
  computed: mapState({
    requestManagementContract: (state) => state.requestManagementInstance,
  }),
  components: {
    AskerRequests,
    LenderRequests,
  },
  // watch: {
  //   requestManagementContract: {
  //     handler: function(contractInstance) {
  //       if (contractInstance !== null && contractInstance !== undefined) {
  //         this.$store.dispatch(UPDATE_REQUESTS, contractInstance)
  //       }
  //     },
  //   },
  // },
}
</script>

<style lang="scss">
.userRequests {
  text-align: center;
}

.v-enter-active {
  transition: opacity 0.2s ease-in;
}

.v-leave-active {
  transition: opacity 0.3s ease-out;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
