<template>
  <div>
    <div class="subtitle">Add / Remove Member</div>
    <div class="userInput">
      <label
        for="userInput__input--memberAddress"
        class="userInput__label userInput__label--memberAddress"
      >Member Address:</label>
      <input
        type="text"
        id="userInput__input--memberAddress"
        class="userInput__inputField userInput__inputField--memberAddress"
        placeholder="Address: 0x0"
        v-model="memberAddress"
      >
      <div class="button button--addMember" @click="memberProposal(true)">Add Member</div>
      <div class="button button--removeMember" @click="memberProposal(false)">Remove Member</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      memberAddress: null
    }
  },
  props: ['contract'],
  methods: {
    async memberProposal(adding) {
      if (this.memberAddress !== null) {
        await this.contract()
          .methods.createMemberProposal(this.memberAddress, adding)
          .send({ from: this.$store.state.web3.coinbase })
        this.memberAddress = null
      } else {
        alert('no address provided')
      }
      this.memberAddress = null
    }
  }
}
</script>

<style lang="scss">
@import './memberProposalInputs';
</style>
