<template>
  <div class="home">
    <div class="title">Lending Requests</div>
    <hr class="separator">
    <hr class="separator">
    <OpenRequests @openRequestOverlay="openRequestCreation" :contract="requestManagementContract">
      <transition>
        <CreateRequest
          v-if="createRequest"
          @closeRequestOverlay="closeRequestCreation"
          :contract="requestManagementContract"
        />
      </transition>
    </OpenRequests>
  </div>
</template>

<script>
import OpenRequests from '@/components/RequestManagement/LendingRequests/openLendingRequests'
import CreateRequest from '../components/RequestManagement/CreateLendingRequest/createLendingRequest'

import { mapState } from 'vuex'
import { UPDATE_REQUESTS } from '@/util/constants/types'

export default {
  computed: mapState({
    requestManagementContract: state => state.requestManagementInstance
  }),
  components: {
    OpenRequests,
    CreateRequest
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

.home {
  text-align: center;
}
</style>
