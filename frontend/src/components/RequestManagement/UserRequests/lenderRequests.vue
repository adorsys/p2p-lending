<template>
  <div class="lenderRequest">
    <div class="table__wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="table__head">Debitor</th>
            <th class="table__head">Amount</th>
            <th class="table__head">Payback</th>
            <th class="table__head">Description</th>
            <th class="table__head">Status</th>
            <th class="table__head"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="r in filteredRequests" :key="r.idx">
            <td class="table__data">{{ r.asker }}</td>
            <td class="table__data">{{ r.askAmount }} ETH</td>
            <td class="table__data">{{ r.paybackAmount }} ETH</td>
            <td class="table__data">{{ r.purpose }}</td>
            <td class="table__data">{{ r.status }}</td>
            <td class="table__data">
              <div
                v-on:click="withdraw(r.address)"
                class="btn btn--table"
                v-if="r.status === 'PaidBack' || r.status === 'Ether Lent'"
                >Withdraw</div
              >
              <span v-if="r.status !== 'PaidBack' && r.status !== 'Ether Lent'"
                >n/a</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { RequestManagementService } from '../../../services/requestManagement/RequestManagementService'
import { Web3Service } from '../../../services/web3/Web3Service'
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
    async getRequests() {
      this.filteredRequests = []
      const user = await Web3Service.getUser()
      if (user) {
        const locale = navigator.userLanguage || navigator.language
        this.requests.forEach((element) => {
          if (
            String(user).toLocaleUpperCase(locale) ===
            String(element.lender).toLocaleUpperCase(locale)
          ) {
            this.filteredRequests.push(element)
          }
        })
      }
    },
    withdraw(address) {
      RequestManagementService.withdraw(address)
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
