<template>
  <div>
    <div class="subtitle">Board Inputs:</div>
    <div class="userInput">
      <label
        for="userInput__input--contractFee"
        class="userInput__label userInput__label--contractFee"
      >Proposed Fee:</label>
      <label
        for="userInput__input--memberAddress"
        class="userInput__label userInput__label--memberAddress"
      >Member Address:</label>
      <label
        for="userInput__input--memberName"
        class="userInput__label userInput__label--memberName"
      >Member Name:</label>
      <input
        type="text"
        id="userInput__input--contractFee"
        class="userInput__inputField userInput__inputField--contractFee"
        placeholder="0.0 ETH"
        v-model="proposedFee"
      >
      <input
        type="text"
        id="userInput__input--memberAddress"
        class="userInput__inputField userInput__inputField--memberAddress"
        placeholder="Member Address ( 0x0 )"
        v-model="memberAddress"
      >
      <input
        type="text"
        id="userInput__input--memberName"
        class="userInput__inputField userInput__inputField--memberName"
        placeholder="Member Name"
        v-model="memberName"
      >
      <div
        class="button button--lendingBoard userInput__button--changeFee"
        @click="changeFee"
      >Change Fee</div>
      <div
        class="button button--lendingBoard userInput__button--addMember"
        @click="addMember"
      >Add Member</div>
      <div
        class="button button--lendingBoard userInput__button--removeMember"
        @click="removeMember"
      >Remove Member</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      proposedFee: null,
      memberAddress: null,
      memberName: null
    }
  },
  methods: {
    async changeFee() {
      if (this.proposedFee == null) {
        console.log('please provide a fee with your request')
      } else {
        let feeToFinney = this.proposedFee * 1000
        await this.$store.state
          .contractInstance()
          .methods.createFeeProposal(feeToFinney)
          .send({ from: this.$store.state.web3.coinbase })
        this.proposedFee = null
      }
    },
    async addMember() {
      if (this.memberAddress === null || this.memberName === null) {
        console.log(
          'please provide the address and the name of the member you want to add'
        )
      } else {
        if (
          this.memberAddress.charAt(0) !== 0 &&
          this.memberAddress.charAt(1) !== 'x' &&
          this.memberAddress.length !== 42
        ) {
          console.log('wrong format')
        } else {
          await this.$store.state
            .contractInstance()
            .methods.createMembershipProposal(
              1,
              this.memberAddress,
              String(this.memberName)
            )
            .send({ from: this.$store.state.web3.coinbase })
        }
      }
      this.memberAddress = null
      this.memberName = null
    },
    async removeMember() {
      if (this.memberAddress === null) {
        console.log(
          'please provide the address and the name of the member you want to remove'
        )
      } else {
        if (
          this.memberAddress.charAt(0) !== 0 &&
          this.memberAddress.charAt(1) !== 'x' &&
          this.memberAddress.length !== 42
        ) {
          console.log('wrong format')
        } else {
          await this.$store.state
            .contractInstance()
            .methods.createMembershipProposal(2, this.memberAddress, 'empty')
            .send({ from: this.$store.state.web3.coinbase })
        }
      }
      this.memberAddress = null
      this.memberName = null
    }
  }
}
</script>

<style lang="scss">
@import '@/components/LendingBoard/Inputs/inputs.scss';
</style>
