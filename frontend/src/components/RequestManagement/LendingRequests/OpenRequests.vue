<template>
  <div class="openRequests">
    <div class="lead">Requests waiting for Creditor</div>
    <div class="table__wrapper">
      <table class="table" v-if="filteredRequests.length > 0">
        <thead>
          <tr>
            <th class="table__head">Debitor</th>
            <th class="table__head">Amount</th>
            <th class="table__head">Payback</th>
            <th class="table__head">Purpose</th>
            <th class="table__head"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="r in filteredRequests" :key="r.idx">
            <td
              class="table__data"
              v-bind:class="{ trusted: r.verifiedAsker }"
              >{{ r.asker }}</td
            >
            <td class="table__data">{{ r.askAmount }} ETH</td>
            <td class="table__data">{{ r.paybackAmount }} ETH</td>
            <td class="table__data">{{ r.purpose }}</td>
            <td class="table__data">
              <div v-on:click="lend(r.address)" class="btn btn--table"
                >Lend</div
              >
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table" v-else>
        <thead>
          <tr>
            <th class="table__head">Requests</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row">
            <td class="table__data">No Requests Found</td>
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
    }
  },
  methods: {
    lend(address) {
      RequestManagementService.lend(address)
    },
    async getRequests() {
      this.filteredRequests = []
      const user = await Web3Service.getUser()
      if (user) {
        const locale = navigator.userLanguage || navigator.language
        this.requests.forEach((element) => {
          if (
            element.lent === false &&
            String(user).toLocaleUpperCase(locale) !==
              String(element.asker).toLocaleUpperCase(locale)
          ) {
            this.filteredRequests.push(element)
          }
        })
      }
    },
  },
  watch: {
    requests() {
      this.getRequests()
    },
  },
  mounted() {
    this.getRequests()
  },
}
</script>
