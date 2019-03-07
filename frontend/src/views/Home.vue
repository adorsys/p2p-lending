<template>
  <div class="home">
    <div class="title">Lending Requests</div>
    <hr class="separator">
    <hr class="separator">
    <OpenRequests
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
    </OpenRequests>
    <UserRequests/>
  </div>
</template>

<script>
import OpenRequests from '@/components/RequestManagement/LendingRequests/openLendingRequests'
import UserRequests from '@/components/RequestManagement/LendingRequests/userLendingRequests'
import CreateRequest from '../components/RequestManagement/CreateLendingRequest/createLendingRequest'
import { initializeRequestManagementContract } from '@/services/web3/requestManagement/initializeRmContract'

export default {
  components: {
    OpenRequests,
    UserRequests,
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
