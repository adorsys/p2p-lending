<template>
  <div>
    <div class="subtitle">Change Contract Fee</div>
    <div class="userInput">
      <label
        for="userInput__input--contractFee"
        class="userInput__label userInput__label--contractFee"
      >Proposed Fee:</label>
      <input
        type="text"
        id="userInput__input--contractFee"
        class="userInput__inputField userInput__inputField--contractFee"
        placeholder="Fee in ETH"
        v-model="proposedFee"
      >
      <div class="button button--contractFee" @click="createContractFeeProposal">Change Fee</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['contract'],
  data() {
    return {
      proposedFee: null
    }
  },
  methods: {
    async createContractFeeProposal() {
      if (this.contract) {
        if (this.proposedFee !== null) {
          const newFee = this.$store.state.web3
            .web3Instance()
            .utils.toWei(this.proposedFee, 'ether')
          await this.contract()
            .methods.createContractFeeProposal(newFee)
            .send({ from: this.$store.state.web3.coinbase })
        } else {
          alert('provide a fee')
        }
      }
      this.proposedFee = null
    }
  }
}
</script>

<style lang="scss">
@import './contractFeeInputs';
</style>
