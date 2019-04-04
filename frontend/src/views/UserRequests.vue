<template>
  <div class="userRequests">
    <div class="title">User Requests</div>
    <hr class="separator">
    <hr class="separator">
    <CreateRequest @openRequestOverlay="openRequestCreation">
      <transition>
        <CreateLendingRequest
          v-if="createRequest"
          @closeRequestOverlay="closeRequestCreation"
          :contract="requestManagementContract"
        />
      </transition>
    </CreateRequest>
    <hr class="separator">
    <AskerRequests :contract="requestManagementContract"/>
    <hr class="separator">
    <LenderRequests :contract="requestManagementContract"/>
  </div>
</template>

<script>
import AskerRequests from '@/components/RequestManagement/UserRequests/askerRequests'
import LenderRequests from '@/components/RequestManagement/UserRequests/lenderRequests'
import CreateRequest from '@/components/RequestManagement/CreateLendingRequest/createRequest'
import CreateLendingRequest from '@/components/RequestManagement/CreateLendingRequest/createLendingRequest'

import { mapState } from 'vuex'
import { UPDATE_REQUESTS } from '@/util/constants/types'

export default {
  computed: mapState({
    requestManagementContract: state => state.requestManagementInstance
  }),
  components: {
    AskerRequests,
    LenderRequests,
    CreateRequest,
    CreateLendingRequest
  },
  data() {
    return {
      createRequest: false
    }
  },
  methods: {
    openRequestCreation() {
      this.createRequest = true
    },
    closeRequestCreation() {
      this.createRequest = false
    }
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
