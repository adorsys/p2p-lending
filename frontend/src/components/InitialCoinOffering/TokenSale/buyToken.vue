<template>
  <div>
    <div class="subtitle">Buy TrustToken</div>
    <div class="userInput userInput--buyToken">
      <label
        for="userInput__inputField--buyToken"
        class="userInput__label userInput__label--buyToken"
      >Buy TrustToken</label>
      <input
        type="text"
        id="userInput__inputField--buyToken"
        class="userInput__inputField userInput__inputField--buyToken"
        v-model="amountToSpend"
        placeholder="ETH to spend"
      >
      <div class="button button--buyToken" @click="buy">Buy</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amountToSpend: null
    }
  },
  props: ['contract'],
  methods: {
    async buy() {
      if (this.amountToSpend > 0) {
        const buyAmount = this.$store.state.web3
          .web3Instance()
          .utils.toWei(this.amountToSpend, 'ether')
        await this.contract()
          .methods.participate()
          .send({ value: buyAmount, from: this.$store.state.web3.coinbase })
      } else {
        alert('Please enter the amount you want to spend')
      }
      this.amountToSpend = null
    }
  }
}
</script>

<style lang="scss">
@import './buyToken';
</style>
