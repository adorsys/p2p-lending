<template>
  <div class="createLendingRequest">
    <div class="createLendingRequest__mask">
      <div class="createLendingRequest__wrapper">
        <div class="createLendingRequest__container">
          <div class="subtitle subtitle--createLendingRequest">Create Lending Request</div>
          <hr class="separator">
          <hr class="separator">
          <div class="userInput userInput--lendingRequest">
            <label
              for="userInput__inputField--askAmount"
              class="userInput__label userInput__label--requestManagement userInput__label--askAmount"
            >Ask for:</label>
            <label
              for="userInput__inputField--paybackAmount"
              class="userInput__label userInput__label--requestManagement userInput__label--paybackAmount"
            >Payback Amount:</label>
            <label
              for="userInput__inputField--requestDescription"
              class="userInput__label userInput__label--requestManagement userInput__label--requestDescription"
            >Request Description:</label>
            <input
              type="text"
              id="userInput__inputField--askAmount"
              class="userInput__inputField userInput__inputField--askAmount"
              v-model="askAmount"
              placeholder="Ask Amount in ETH"
            >
            <input
              type="text"
              id="userInput__inputField--paybackAmount"
              class="userInput__inputField userInput__inputField--paybackAmount"
              v-model="paybackAmount"
              placeholder="Payback Amount in [askAmount ... x] ETH"
            >
            <input
              type="text"
              id="userInput__inputField--requestDescription"
              class="userInput__inputField userInput__inputField--requestDescription"
              v-model="requestPurpose"
              placeholder="Request Description"
            >
          </div>
          <div class="createBounty__buttons">
            <div class="button control__button--reset" @click="$emit('closeRequestOverlay')">Close</div>
            <div class="button button--lendingRequest" @click="createRequest">Create New Request</div>
          </div>
        </div>
      </div>
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
      askAmount: null,
      paybackAmount: null,
      requestPurpose: null
    }
  },
  methods: {
    async createRequest() {
      const payback = parseFloat(this.paybackAmount, 10)
      const asking = parseFloat(this.askAmount, 10)
      if (
        this.askAmount !== null &&
        this.paybackAmount !== null &&
        payback > asking &&
        this.requestPurpose !== null
      ) {
        const askWei = this.$store.state.web3
          .web3Instance()
          .utils.toWei(this.askAmount, 'Ether')
        const paybackWei = this.$store.state.web3
          .web3Instance()
          .utils.toWei(this.paybackAmount, 'Ether')
        await this.contract()
          .methods.ask(askWei, paybackWei, this.requestPurpose)
          .send({ from: this.$store.state.web3.coinbase })
        this.$emit('closeRequestOverlay')
      } else {
        console.log('invalid input')
      }
      this.askAmount = null
      this.paybackAmount = null
      this.requestPurpose = null
    }
  }
}
</script>

<style lang="scss">
@import './createLendingRequest';
</style>
