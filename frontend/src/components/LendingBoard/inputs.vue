<template>
  <div>
    <hr>
    <h3>Inputs</h3>
    <div class="inputs">
      <div>
        <span>Proposed Fee:</span>
        <input v-model="proposedFee" placeholder="0">
      </div>
      <div>
        Member Address:
        <input v-model="memberAddress" placeholder="0x0">
      </div>
      <div>
        Member Name:
        <input v-model="memberName" placeholder="Cpt. Placeholder">
      </div>
    </div>
    <hr>
    <div class="buttons">
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
      console.log('add member')
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
          console.log('adding member:', this.memberAddress, this.memberName)
          // check if member does not exist yet
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
      console.log('Remove Member')
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
          console.log('trying to remove member:', this.memberAddress)
          // check if member exists
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
@import '@/components/LendingBoard/inputs.scss';
</style>
