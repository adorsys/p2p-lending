<template>
  <div class="requests">
    <section class="requests__top">
      <div class="title">Lending Requests</div>
      <div class="requestNavigation">
        <ul class="requestNavigation__links">
          <li class="requestNavigation__link-container">
            <div
              class="requestNavigation__link"
              v-bind:class="{ 'requestNavigation__link--active': allRequests }"
              @click="allRequests = true"
            >
              Available Requests
            </div>
          </li>
          <li class="requestNavigation__link-container">
            <div
              class="requestNavigation__link"
              v-bind:class="{ 'requestNavigation__link--active': !allRequests }"
              @click="allRequests = false"
            >
              Your Requests
            </div>
          </li>
        </ul>
      </div>
      <CreateRequest @openRequestOverlay="openRequestCreation">
        <transition>
          <CreateLendingRequest
            v-if="createRequest"
            @closeRequestOverlay="closeRequestCreation"
            :contract="requestManagementContract"
          />
        </transition>
      </CreateRequest>
    </section>
    <section class="requests__data">
      <div class="allRequests" v-if="allRequests">
        <OpenRequests
          :contract="requestManagementContract"
          v-if="allRequests"
        />
      </div>
      <div class="userRequests" v-if="!allRequests">
        <AskerRequests :contract="requestManagementContract" />
        <div class="userRequests__separator"></div>
        <LenderRequests :contract="requestManagementContract" />
      </div>
    </section>
  </div>
</template>

<script>
import OpenRequests from '@/components/RequestManagement/LendingRequests/openLendingRequests'
import AskerRequests from '@/components/RequestManagement/UserRequests/askerRequests'
import LenderRequests from '@/components/RequestManagement/UserRequests/lenderRequests'
import CreateRequest from '@/components/RequestManagement/CreateLendingRequest/createRequest'
import CreateLendingRequest from '@/components/RequestManagement/CreateLendingRequest/createLendingRequest'

import { mapState } from 'vuex'
import { UPDATE_REQUESTS } from '@/util/constants/types'

export default {
  name: 'requests',
  components: {
    OpenRequests,
    AskerRequests,
    LenderRequests,
    CreateRequest,
    CreateLendingRequest
  },
  computed: mapState({
    requestManagementContract: state => state.requestManagementInstance
  }),
  data() {
    return {
      allRequests: true,
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
        if (contractInstance) {
          this.$store.dispatch(UPDATE_REQUESTS, contractInstance)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../util/scss/requests';
</style>
