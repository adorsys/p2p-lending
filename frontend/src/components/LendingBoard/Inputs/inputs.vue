<template>
  <div>
    <hr>
    <div class="LendingBoardInputLabels">
      <label for="lending-board-input-fee">Proposed Fee:</label>
      <label class="input-address" for="lending-board-input-address">Member Address:</label>
      <label for="lending-board-input-name">Member Name:</label>
    </div>
    <div class="LendingBoardInputs">
      <div>
        <input type="text" id="lending-board-input-fee" v-model="proposedFee" placeholder="0">
      </div>
      <div>
        <input
          type="text"
          id="lending-board-input-address"
          v-model="memberAddress"
          placeholder="0x0"
        >
      </div>
      <div>
        <input
          type="text"
          id="lending-board-input-name"
          v-model="memberName"
          placeholder="Cpt. Placeholder"
        >
      </div>
    </div>
    <hr>
    <div class="lending-board-buttons">
      <button @click="changeFee">Change Fee</button>
      <button @click="addMember">Add Member</button>
      <button @click="removeMember">Remove Member</button>
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
        console.log('changing fee to:', this.proposedFee)
        await this.$store.state
          .contractInstance()
          .methods.createFeeProposal(this.proposedFee)
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

<style lang="scss" scoped>
@import '@/components/LendingBoard/Inputs/inputs.scss';
</style>
