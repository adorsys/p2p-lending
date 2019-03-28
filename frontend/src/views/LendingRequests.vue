<template>
  <div class="home">
    <div class="title">Lending Requests</div>
    <hr class="separator">
    <hr class="separator">
    <OpenRequests :contract="requestManagementContract"/>
  </div>
</template>

<script>
import OpenRequests from '@/components/RequestManagement/LendingRequests/openLendingRequests'

import { mapState } from 'vuex'
import { UPDATE_REQUESTS } from '@/util/constants/types'

export default {
  computed: mapState({
    requestManagementContract: state => state.requestManagementInstance
  }),
  components: {
    OpenRequests
  },
  watch: {
    requestManagementContract: {
      handler: function(contractInstance) {
        if (contractInstance) {
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

.subtitle--description {
  text-decoration: none;
  margin-bottom: 0.5em;
}
</style>
