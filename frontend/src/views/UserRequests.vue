<template>
  <div class="home">
    <div class="title">User Requests</div>
    <hr class="separator">
    <hr class="separator">
    <AskerRequests :contract="requestManagementContract"/>
    <hr class="separator">
    <hr class="separator">
    <LenderRequests :contract="requestManagementContract"/>
  </div>
</template>

<script>
import AskerRequests from '@/components/RequestManagement/UserRequests/askerRequests'
import LenderRequests from '@/components/RequestManagement/UserRequests/lenderRequests'

import { mapState } from 'vuex'
import { UPDATE_REQUESTS } from '@/util/constants/types'

export default {
  computed: mapState({
    requestManagementContract: state => state.requestManagementInstance
  }),
  components: {
    AskerRequests,
    LenderRequests
  },
  watch: {
    requestManagementContract: {
      handler: function(contractInstance) {
        if (contractInstance !== null && contractInstance !== undefined) {
          this.$store.dispatch(UPDATE_REQUESTS, contractInstance)
        }
      }
    }
  }
}
</script>


<style lang="scss">
.home {
  text-align: center;
}
</style>
