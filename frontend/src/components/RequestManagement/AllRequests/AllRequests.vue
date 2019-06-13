<template>
  <div class="allRequests">
    <div class="allRequests__title-wrapper">
      <div class="allRequests__title">Requests</div>
      <div class="allRequests__sortOptions">
        <div
          class="allRequests__sortOption"
          @click="getRequests"
          v-bind:class="{ 'allRequests__sortOption--active': !trustedRequests }"
          >All</div
        >
        <div
          class="allRequests__sortOption"
          @click="getTrustedRequests"
          v-bind:class="{ 'allRequests__sortOption--active': trustedRequests }"
          >Trusted</div
        >
      </div>
    </div>
    <div class="table__wrapper">
      <table class="table" v-if="filteredRequests.length > 0">
        <thead>
          <tr>
            <th class="table__head table__head--id"></th>
            <th class="table__head table__head--asker">Asker</th>
            <th class="table__head">Amount</th>
            <th class="table__head">Payback</th>
            <th class="table__head table__head--purpose">Purpose</th>
            <th class="table__head">Trusted</th>
            <th class="table__head table__head--option"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="table__row"
            v-for="(item, index) in filteredRequests"
            :key="index"
          >
            <td class="table__data table__data--id">{{ index + 1 }}</td>
            <td class="table__data table__data--purpose">{{ item.asker }}</td>
            <td class="table__data">{{ item.askAmount }} ETH</td>
            <td class="table__data">{{ item.paybackAmount }} ETH</td>
            <td class="table__data">{{ item.purpose }}</td>
            <td class="table__data">
              <div
                class="table__status table__status--trusted"
                v-if="item.verifiedAsker"
                >Yes</div
              >
              <div class="table__status table__status--untrusted" v-else
                >No</div
              >
            </td>
            <td class="table__data">
              <div class="btn btn--table" @click="lend(item.address)">Lend</div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table" v-else>
        <thead>
          <tr>
            <th class="table__head table__head--empty">Requests</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row">
            <td class="table__data table__data--empty">No Requests Found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Web3Service } from '../../../services/web3/Web3Service'
import { RequestManagementService } from '../../../services/requestManagement/RequestManagementService'

export default {
  computed: {
    ...mapState('requestManagement', ['requests']),
  },
  data() {
    return {
      filteredRequests: [],
      trustedRequests: false,
    }
  },
  methods: {
    lend(address) {
      RequestManagementService.lend(address)
    },
    async getRequests() {
      this.filteredRequests = []

      const user = await Web3Service.getUser()
      if (!user) {
        return
      }

      const locale = navigator.userLanguage || navigator.language
      const comparableAddress = String(user).toLocaleUpperCase(locale)

      this.requests.forEach((element) => {
        if (
          !element.lent &&
          comparableAddress !== String(element.asker).toLocaleUpperCase(locale)
        ) {
          this.filteredRequests.push(element)
        }
      })

      // reflect display option internally
      this.trustedRequests = false
    },
    async getTrustedRequests() {
      this.filteredRequests = []

      const user = await Web3Service.getUser()
      if (!user) {
        return
      }

      const locale = navigator.userLanguage || navigator.language
      const comparableAddress = String(user).toLocaleUpperCase(locale)

      this.requests.forEach((element) => {
        if (
          !element.lent &&
          element.verifiedAsker &&
          comparableAddress !== String(element.asker).toLocaleUpperCase(locale)
        ) {
          this.filteredRequests.push(element)
        }
      })

      // reflect display option internally
      this.trustedRequests = true
    },
  },
  watch: {
    requests() {
      this.trustedRequests ? this.getTrustedRequests() : this.getRequests()
    },
  },
  mounted() {
    this.trustedRequests ? this.getTrustedRequests() : this.getRequests()
  },
}
</script>

<style lang="scss">
@import 'AllRequests';
</style>
