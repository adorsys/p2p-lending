<template>
  <div class="userRequests">
    <div class="userRequests__title">Requests</div>
    <div class="table__wrapper">
      <table class="table" v-if="filteredRequests.length > 0">
        <thead>
          <tr>
            <th class="table__head table__head--id"></th>
            <th class="table__head table__head--purpose">Purpose</th>
            <th class="table__head">Amount Asked</th>
            <th class="table__head">Payback Amount</th>
            <th class="table__head table__head--state">State</th>
            <th class="table__head">Option</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="table__row"
            v-for="(item, index) in filteredRequests"
            :key="index"
          >
            <td class="table__data table__data--id">{{ index + 1 }}</td>
            <td class="table__data table__data--purpose">{{ item.purpose }}</td>
            <td class="table__data">{{ item.askAmount }} ETH</td>
            <td class="table__data">{{ item.paybackAmount }} ETH</td>
            <td class="table__data">{{ item.status }}</td>
            <td class="table__data">
              <div
                class="btn btn--table"
                @click="cancel(item.address)"
                v-if="item.isAsker && item.status === 'Waiting'"
                >Cancel</div
              >
              <div
                class="btn btn--table"
                @click="withdraw(item.address)"
                v-if="item.isLender && item.status === 'Ether Lent'"
                >Cancel</div
              >
              <div
                class="btn btn--table"
                @click="withdraw(item.address)"
                v-if="
                  (item.isLender && item.status === 'PaidBack') ||
                    (item.isAsker && item.status === 'Ether Lent')
                "
                >Withdraw</div
              >
              <div
                class="btn btn--table"
                @click="payback(item.address)"
                v-if="item.isAsker && item.status === 'Withdrawn'"
                >Deposit</div
              >
              <div
                v-if="
                  (item.isLender &&
                    item.status !== 'PaidBack' &&
                    item.status !== 'Ether Lent') ||
                    (item.isAsker &&
                      item.status !== 'Withdrawn' &&
                      item.status !== 'Ether Lent' &&
                      item.status !== 'Waiting')
                "
                >n/a</div
              >
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
    }
  },
  methods: {
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
          comparableAddress === String(element.asker).toLocaleUpperCase(locale)
        ) {
          element.isAsker = true
          this.filteredRequests.push(element)
        }

        if (
          comparableAddress === String(element.lender).toLocaleUpperCase(locale)
        ) {
          element.isLender = true
          this.filteredRequests.push(element)
        }
      })
    },
    cancel(address) {
      RequestManagementService.cancel(address)
    },
    withdraw(address) {
      RequestManagementService.withdraw(address)
    },
    payback(address) {
      RequestManagementService.payback(address)
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

<style lang="scss">
@import 'UserRequests';
</style>
