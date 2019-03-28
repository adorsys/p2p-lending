<template>
  <div class="icoManagement">
    <div class="subtitle subtitle--icoManagement">Transfer TrustToken</div>
    <div class="userInput userInput--twoRows">
      <label
        for="userInput__inputField--transferAddress"
        class="userInput__label userInput__label--firstLabel"
      >Address to send to:</label>
      <label
        for="userInput__inputField--transferToken"
        class="userInput__label userInput__label--secondLabel"
      >Amount to send:</label>
      <input
        type="text"
        id="userInput__inputField--transferAddress"
        class="userInput__inputField userInput__inputField--firstInput"
        placeholder="Address"
        v-model="transferTokenTo"
      >
      <input
        type="text"
        id="userInput__inputField--transferToken"
        class="userInput__inputField userInput__inputField--secondInput"
        placeholder="Amount in [0...x]"
        v-model="tokenAmount"
      >
      <div class="button button--icoManagement button--secondRow" @click="transfer">Transfer</div>
    </div>
    <hr class="separator">
    <div class="subtitle subtitle--icoManagement">Approve User to use your TrustToken</div>
    <div class="userInput userInput--twoRows">
      <label
        for="userInput__inputField--approveAddress"
        class="userInput__label userInput__label--firstLabel"
      >Address to approve:</label>
      <label
        for="userInput__inputField--approveAmount"
        class="userInput__label userInput__label--secondLabel"
      >Amount to provide:</label>
      <input
        type="text"
        id="userInput__inputField--approveAddress"
        class="userInput__inputField userInput__inputField--firstInput"
        placeholder="Address of User"
        v-model="approveAddress"
      >
      <input
        type="text"
        id="userInput__inputField--approveAmount"
        class="userInput__inputField userInput__inputField--secondInput"
        placeholder="Amount in [0...x]"
        v-model="approveAmount"
      >
      <div class="button button--icoManagement button--secondRow" @click="approve">Approve</div>
    </div>
    <hr class="separator">
    <div class="subtitle subtitle--icoManagement">Spend TrustToken for another Account</div>
    <div class="userInput userInput--threeRows">
      <label
        for="userInput__inputField--transferFrom"
        class="userInput__label userInput__label--firstLabel"
      >Transfer From:</label>
      <label
        for="userInput__inputField--transferTo"
        class="userInput__label userInput__label--secondLabel"
      >Transfer To:</label>
      <label
        for="userInput__inputField--transferAmount"
        class="userInput__label userInput__label--thirdLabel"
      >Amount to transfer:</label>
      <input
        type="text"
        id="userInput__inputField--transferFrom"
        class="userInput__inputField userInput__inputField--firstInput"
        placeholder="Transfer from address"
        v-model="transferFrom"
      >
      <input
        type="text"
        id="userInput__inputField--transferTo"
        class="userInput__inputField userInput__inputField--secondInput"
        placeholder="Transfer to address"
        v-model="transferTo"
      >
      <input
        type="text"
        id="userInput__inputField--transferAmount"
        class="userInput__inputField userInput__inputField--thirdInput"
        placeholder="Transfer Amount"
        v-model="transferAmount"
      >
      <div class="button button--icoManagement button--thirdRow" @click="transferFor">Transfer</div>
    </div>
    <hr class="separator">
    <div class="subtitle subtitle--icoManagement">Check Allowance for Account</div>
    <div class="userInput userInput--oneRow">
      <label
        for="userInput__inputField--checkAllowance"
        class="userInput__label userInput__label--firstLabel"
      >Check Address:</label>
      <input
        type="text"
        id="userInput__inputField--checkAllowance"
        class="userInput__inputField userInput__inputField--firstInput"
        placeholder="address"
        v-model="tokenAllowanceAddress"
      >
      <div class="button button--icoManagement" @click="checkAllowance">Check</div>
    </div>
    <div
      class="subtitle subtitle--allowance"
      v-if="tokenAllowance !== null"
    >You are allowed to spend: {{ tokenAllowance }} {{ tokenSymbol }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    tokenSymbol: state => state.icoState.tokenSymbol
  }),
  data() {
    return {
      tokenAmount: null,
      transferTokenTo: null,
      approveAddress: null,
      approveAmount: null,
      transferFrom: null,
      transferTo: null,
      transferAmount: null,
      tokenAllowanceAddress: null,
      tokenAllowance: null
    }
  },
  props: ['contract'],
  methods: {
    async transfer() {
      if (this.tokenAmount !== null && this.transferTokenTo !== null) {
        const amount = this.$store.state.web3
          .web3Instance()
          .utils.toWei(this.tokenAmount, 'ether')
        await this.contract()
          .methods.transfer(this.transferTokenTo, amount)
          .send({ from: this.$store.state.web3.coinbase })
      } else {
        if (this.transferTokenTo === null) {
          alert('specify the address of the recipient of the tokentransfer')
        } else {
          alert('specify the amount of token you want to transfer')
        }
      }
      this.tokenAmount = null
      this.transferTokenTo = null
    },
    async approve() {
      if (this.approveAddress !== null && this.approveAmount !== null) {
        const amount = this.$store.state.web3
          .web3Instance()
          .utils.toWei(this.approveAmount, 'ether')
        await this.contract()
          .methods.approve(this.approveAddress, amount)
          .send({ from: this.$store.state.web3.coinbase })
      } else {
        if (this.approveAddress === null) {
          alert('specify the address you want to approve the transfer for')
        } else {
          alert('specify the tokenamount you want to appprove')
        }
      }
      this.approveAddress = null
      this.approveAmount = null
    },
    async transferFor() {
      if (
        this.transferFrom !== null &&
        this.transferTo !== null &&
        this.transferAmount !== null
      ) {
        const amount = this.$store.state.web3
          .web3Instance()
          .utils.toWei(this.transferAmount, 'ether')
        await this.contract()
          .methods.transferFrom(this.transferFrom, this.transferTo, amount)
          .send({ from: this.$store.state.web3.coinbase })
      } else {
        if (this.transferFrom === null) {
          alert('specify the address you want to transfer from')
        } else if (this.transferTo === null) {
          alert('specify the address you want to transfer to')
        } else {
          alert('specify the amount you want to transfer')
        }
      }
      this.transferFrom = null
      this.transferTo = null
      this.transferAmount = null
    },
    async checkAllowance() {
      if (this.tokenAllowanceAddress !== null) {
        const allowance = await this.contract()
          .methods.allowance(
            this.tokenAllowanceAddress,
            this.$store.state.web3.coinbase
          )
          .call()
        this.tokenAllowance = allowance / 10 ** 18
      } else {
        alert('specify the address you want to check')
      }
      this.tokenAllowanceAddress = null
    }
  }
}
</script>

<style lang="scss">
@import './icoManagement';
</style>
