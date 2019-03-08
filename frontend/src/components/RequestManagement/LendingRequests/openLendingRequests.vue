<template>
  <div class="lendingRequestManagement">
    <div class="createLendingRequest">
      <div class="subtitle subtitle--lendingRequest">Create Lending Request</div>
      <div
        class="button button--lendingRequest"
        @click="$emit('openRequestOverlay')"
      >Create Lending Request</div>
      <div class="button button--lendingRequest" @click="getRequests">Get Lending Request</div>
      <slot/>
    </div>
    <hr class="separator">
    <div class="request__management">
      <div class="subtitle subtitle--lendingRequest">Open Lending Requests</div>
      <table class="table" v-if="allProposals.length !== 0">
        <thead>
          <tr>
            <th class="table__head">Asker</th>
            <th class="table__head">Amount Asked</th>
            <th class="table__head">Payback Amount</th>
            <th class="table__head">Purpose</th>
            <th class="table__head">Trusted</th>
            <th class="table__head">Lend Money</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in allProposals" :key="p.idx">
            <td class="table__data">{{ p.author }}</td>
            <td class="table__data">{{ p.askAmount + ' ETH' }}</td>
            <td class="table__data">{{ p.paybackAmount + ' ETH' }}</td>
            <td class="table__data">{{ p.purpose }}</td>
            <td class="table__data" v-if="p.trusted">
              <div class="table__data--trusted">Yes</div>
            </td>
            <td class="table__data" v-if="!p.trusted">
              <div class="table__data--untrusted">No</div>
            </td>
            <td class="table__data table__data--buttons">
              <div
                v-on:click="lend(p.address, p.askAmount)"
                class="button button--table button--lend"
              >Lend</div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table" v-if="allProposals.length === 0">
        <thead>
          <tr class="table__row">
            <th class="table__head">Lending Requests</th>
          </tr>
        </thead>
        <tbody>
          <td class="table__data">No Lending Requests Found</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    contract: state => state.requestManagementInstance
  }),
  data() {
    return {
      allProposals: []
    }
  },
  methods: {
    async lend(address, amount) {
      const lendAmount = this.$store.state.web3
        .web3Instance()
        .utils.toWei(String(amount), 'Ether')
      await this.contract()
        .methods.deposit(address)
        .send({ value: lendAmount, from: this.$store.state.web3.coinbase })
    },
    async getRequests() {
      const account = await this.$store.state.web3
        .web3Instance()
        .eth.getCoinbase()
      try {
        this.allProposals = []
        const openRequests = await this.contract()
          .methods.getRequests(this.contract()._address)
          .call({ from: account })
        if (openRequests.length !== 0) {
          for (let i = 0; i < openRequests.length; i++) {
            const proposalParameters = await this.contract()
              .methods.getProposalParameters(openRequests[i])
              .call()
            const proposalState = await this.contract()
              .methods.getProposalState(openRequests[i])
              .call()
            if (
              String(account).toUpperCase() !==
              proposalParameters.asker.toUpperCase()
            ) {
              const prop = {
                address: openRequests[i],
                author: proposalParameters.asker,
                askAmount: proposalParameters.askAmount / 10 ** 18,
                paybackAmount: proposalParameters.paybackAmount / 10 ** 18,
                purpose: proposalParameters.purpose,
                trusted: proposalState.trusted,
                lent: proposalState.lent
              }
              if (prop.lent === false) {
                this.allProposals.push(prop)
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    requestCreatedListener() {
      // Request Created Listener
      this.contract()
        .events.RequestCreated()
        .once('data', async () => {
          await this.getRequests()
          this.requestCreatedListener()
        })
    },
    depositListener() {
      // Ether Deposited Listener
      this.contract()
        .events.Deposit()
        .once('data', async () => {
          await this.getRequests()
          this.depositListener()
        })
    }
  },
  watch: {
    contract: {
      handler: function(contractInstance) {
        if (contractInstance !== null && contractInstance !== undefined) {
          // requestManagement was initialized -> get all open lending requests
          this.getRequests()

          // start event listeners for request management
          this.requestCreatedListener()
          this.depositListener()

          // reload requests on account change
          // eslint-disable-next-line no-undef
          ethereum.on('accountsChanged', () => {
            this.getRequests()
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import './openLendingRequests';
</style>
