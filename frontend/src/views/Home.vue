<template>
  <div class="home">
    <div class="title">Lending Requests</div>
    <hr class="separator">
    <hr class="separator">
    <Requests
      @openRequestOverlay="openRequestCreation"
      :contract="requestManagementContract"
      :web3="web3"
    >
      <transition>
        <CreateRequest
          v-if="createRequest"
          @closeRequestOverlay="closeRequestCreation"
          :contract="requestManagementContract"
        />
      </transition>
    </Requests>
  </div>
</template>

<script>
import Requests from '@/components/RequestManagement/LendingRequests/lendingRequests'
import CreateRequest from '../components/RequestManagement/CreateLendingRequest/createLendingRequest'
import { initializeRequestManagementContract } from '@/services/web3/requestManagement/initializeRmContract'

export default {
  components: {
    Requests,
    CreateRequest
  },
  data() {
    return {
      requestManagementContract: null,
      web3: null,
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
  async mounted() {
    const initialize = await initializeRequestManagementContract()
    this.requestManagementContract = initialize.contract
    this.web3 = initialize.web3
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
