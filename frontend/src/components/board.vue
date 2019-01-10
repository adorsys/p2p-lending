<template>
  <div class="lending board container">
    <h1>P2P-Lending Member Board</h1>
    <h3>Inputs</h3>
    <div class="inputs">
      <div>
        Proposed Fee:
        <input v-model="board.proposedFee" placeholder="0">
      </div>
      <div>
        Member Address:
        <input v-model="board.memberAddress" placeholder="0x0">
      </div>
      <div>
        Member Name:
        <input v-model="board.memberName" placeholder="Cpt. Placeholder">
      </div>
    </div>
    <fee/>
    <hr>
    <div class="buttons">
      <div v-on:click="changeFee">Change Fee</div>
      <div v-on:click="addMember">Add Member</div>
      <div v-on:click="removeMember">Remove Member</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import ContractFee from '@/components/displayFee'
export default {
  components: {
    fee: ContractFee
  },
  data() {
    return {
      board: {
        proposedFee: null,
        memberAddress: null,
        memberName: null,
        proposalNumber: null,
        agrees: null
      }
    }
  },
  methods: {
    changeFee() {
      if (this.board.proposedFee == null) {
        console.log('please provide a fee with your request')
      } else {
        console.log('changing fee to:', this.board.proposedFee)
        this.$store.state.contractInstance().createFeeProposal(
          this.board.proposedFee,
          {
            from: this.$store.state.web3.coinbase
          },
          (err, result) => {
            if (err) {
              console.log(err)
            }
          }
        )
      }
    },
    addMember() {
      if (this.board.memberAddress == null || this.board.memberName == null) {
        console.log(
          'please provide the address and the name of the member to add'
        )
      } else {
        console.log(
          'trying to add member:',
          this.board.memberName,
          'at address:',
          this.board.memberAddress
        )
        this.$store.state.contractInstance().createMembershipProposal(
          1,
          this.board.memberAddress,
          String(this.board.memberName),
          {
            from: this.$store.state.web3.coinbase
          },
          (err, result) => {
            if (err) {
              console.log(err)
            }
          }
        )
      }
    },
    removeMember() {
      if (this.board.memberAddress == null) {
        console.log(
          'please provide the address of the member you want to remove'
        )
      } else {
        console.log('trying to remove member:', this.board.memberAddress)
        this.$store.state.contractInstance().createMembershipProposal(
          2,
          this.board.memberAddress,
          String('empty'),
          {
            from: this.$store.state.web3.coinbase
          },
          (err, result) => {
            if (err) {
              console.log(err)
            }
          }
        )
      }
    }
  },
  mounted() {
    console.log('dispatching getContractInstance')
    this.$store.dispatch('getContractInstance')
  }
}
</script>

<style scoped>
.inputs {
  margin: 25px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 25px;
  grid-row-gap: 25px;
}

.inputs > div {
  margin-right: 5px;
}

.buttons {
  margin: 25px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 25px;
  grid-row-gap: 25px;
}
.buttons > div {
  width: 200px;
  padding: 20px;
  margin: auto;
  cursor: pointer;
  background-color: #fff;
  border: 2px solid #034234;
  border-radius: 10px;
  color: #0f3242;
  box-shadow: 2px 2px #0c0b0c;
}
</style>
