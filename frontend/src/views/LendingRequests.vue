<template>
  <div class="lendingRequests">
    <div class="x-large">Lending Requests</div>
    <hr class="separator" />
    <hr class="separator" />
    <OpenRequests :contract="requestManagementContract" />
  </div>
</template>

<script>
import OpenRequests from '@/components/RequestManagement/LendingRequests/openLendingRequests'

import { mapState } from 'vuex'
import { UPDATE_REQUESTS } from '@/util/constants/types'

export default {
  computed: mapState({
    requestManagementContract: (state) => state.requestManagementInstance,
  }),
  components: {
    OpenRequests,
  },
  watch: {
    requestManagementContract: {
      handler: function(contractInstance) {
        if (contractInstance) {
          this.$store.dispatch(UPDATE_REQUESTS, contractInstance)
        }
      },
    },
  },
}
</script>

<style lang="scss">
.lendingRequests {
  text-align: center;
}
</style>
