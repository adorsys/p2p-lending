<template>
  <div class="home">
    <div class="title">Lending Requests</div>
    <hr class="separator">
    <hr class="separator">
    <Requests @openRequestOverlay="createRequest = true">
      <transition>
        <CreateRequest v-if="createRequest" @closeRequestOverlay="createRequest = false"/>
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
      createRequest: false
    }
  },
  methods: {
    toggleCreation() {
      this.createRequest = true
    }
  },
  async mounted() {
    this.requestManagementContract = await initializeRequestManagementContract()
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
