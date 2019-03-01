<template>
  <div class="ico">
    <h1>ICO Management</h1>
    <hr>
    <!-- <input
      type="text"
      name="ico__input-1"
      id="ico__input-1"
      class="ico__input"
      v-model="input_1"
      placeholder="input-1"
    >
    <div class="button button--ico" @click="submit">Submit</div>
    <div class="button button--ico" @click="receive">Receive</div>-->

    <div class="ico__details">
      <h3><div>
      <p v-if="isIcoActive" id="active_green"> ICO is active </p>
      <p v-else id="unactive_red">ICO ist not active</p>
      </div></h3>
      <h3>{{ "Total TrustToken: " + totalTokenSupply+" "+tokenSymbol}}</h3>
      <h3>{{ "Contract Balance/Goal: " + contractEtherBalance + "/"+icoGoal + " Ether"}}</h3>
      <h3>{{ "You own: "+ tokenBalanceUser +" "+tokenSymbol}}</h3>
      <h3>{{ "You have already invested: "+ etherBalanceUser +" Ether"}}</h3>
      <h3>{{ "Participants count: " + icoParticipantCount}}</h3>
    </div>
    <hr>
    
    <div v-if="isIcoActive" >
        <h3>{{ "Buy TrustToken"}}</h3>
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="etherAmount"
          placeholder="Ether"
        >
        <div class="button button--ico" @click="participate">Buy</div>

        <ChartDoughnut/>
    </div>
    
    <div v-else>            
        <h3 >{{"Send "+ tokenSymbol +" to "}}</h3>
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="transferTokenAmount"
          placeholder="TrustToken"
        >
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="transferTo"
          placeholder="to address"
        >
        <div class="button button--ico" @click="transfer">Send</div>
        
        <hr>
        
        <h3 >{{"Approve another account to use a certain amount of "+tokenSymbol+" from your account"}}</h3>
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="approveTokenAmount"
          placeholder="TrustToken"
        >
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="approveSpender"
          placeholder="address"
        >
        <div class="button button--ico" @click="approve">Approve</div>
       
        <hr>
        
        <h3 >{{"Send "+tokenSymbol+" to an account in the name of another account"}}</h3>
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="transferTokenAmountFrom"
          placeholder="TrustToken"
        >
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="transferFrom"
          placeholder="from address"
        >
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="transferFromTo"
          placeholder="to address"
        >
        <div class="button button--ico" @click="transferFromMethod">Send</div>
        
        <hr>
        
        <h3 >{{"Token amount of address, you are allowed to spend"}}</h3>
        <h4 >{{"You are allowed to spend "+ tokenAmountAllowsToSpend +" "+ tokenSymbol+ " from entered account"}}</h4>
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="checkAddress"
          placeholder="address"
        >
        <div class="button button--ico" @click="checkAllowance">Check</div>
        

    </div>
    
    
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChartDoughnut from '@/components/InitialCoinOfering/chart-doughnut'
import { INIT_ICO_CONTRACT } from '@/util/constants/types'

export default {
  components: {
    ChartDoughnut
  },
  computed: mapState({
    icoGoal: state => state.icoState.icoGoal,
    contractEtherBalance: state => state.icoState.icoEtherBalance,
    isIcoActive: state => state.icoState.isIcoActive,
    totalTokenSupply: state => state.icoState.totalTokenSupply,
    icoParticipantCount: state => state.icoState.icoParticipantCount,
    tokenSymbol: state => state.icoState.tokenSymbol,
    tokenBalanceUser: state => state.icoState.tokenBalanceUser,
    etherBalanceUser: state => state.icoState.etherBalanceUser,
    name: state => state.icoState.name,
    decimals : state => state.icoState.decimals
  }),
  data() {
    return {
      input_1: null,
      etherAmount: null,
      transferTo: null,
      transferTokenAmount: null,
      approveTokenAmount:null,
      approveSpender: null,
      transferTokenAmountFrom: null,
      transferFrom: null,
      transferFromTo: null,
      tokenAmountAllowsToSpend: 0,
      checkAddress: null


    }
  },
  methods: {
    async submit() {
      await this.$store.state
        .icoContractInstance()
        .methods.set(parseInt(this.input_1, 10))
        .send({ from: this.$store.state.web3.coinbase })
    },
    async receive() {
      this.output_1 = await this.$store.state
        .icoContractInstance()
        .methods.get()
        .call()
      console.log(this.$store.state.web3.web3Instance())
      console.log(this.$store.state.icoContractInstance())

      console.log(
        this.$store.state.web3
          .web3Instance()
          .utils.fromWei(this.etherBalanceUser, 'ether')
      )
    },
    async participate() {
      await this.$store.state
        .icoContractInstance()
        .methods.participate()
        .send({
          from: this.$store.state.web3.coinbase,
          value: this.$store.state.web3
            .web3Instance()
            .utils.toWei(this.etherAmount, 'ether')
        })
        
    },
    async transfer() {
      let transferAmount = await this.$store.state.web3.web3Instance().utils.toWei(this.transferTokenAmount, "ether")
      await this.$store.state
        .icoContractInstance()
        .methods.transfer(this.transferTo , transferAmount)
        .send({
          from: this.$store.state.web3.coinbase
        })
    },
    async approve() {
      let transferAmount = await this.$store.state.web3.web3Instance().utils.toWei(this.approveTokenAmount, "ether")
      await this.$store.state
        .icoContractInstance()
        .methods.approve(this.approveSpender , transferAmount)
        .send({
          from: this.$store.state.web3.coinbase
        })
    },
    async transferFromMethod() {
      let transferAmount = await this.$store.state.web3.web3Instance().utils.toWei(this.transferTokenAmountFrom, "ether")
      await this.$store.state
        .icoContractInstance()
        .methods.transferFrom(this.transferFrom,this.transferFromTo,transferAmount)
        .send({
          from: this.$store.state.web3.coinbase
        })
    },
    async checkAllowance() {
      
      this.tokenAmountAllowsToSpend = await this.$store.state.web3.web3Instance().utils.fromWei( await this.$store.state
        .icoContractInstance()
        .methods.allowance(this.checkAddress,this.$store.state.web3.coinbase)
        .call(), "ether")
    }
  },
  async mounted() {
    await this.$store.dispatch(INIT_ICO_CONTRACT)
    this.$emit('loaded')
  }
}
</script>

<style lang="scss">
@import '../../util/scss/variables';

.ico__input {
  padding: 0.7em;
  background-color: $navbar-hover-color;
  border: 2px solid rgba($color: $border-color, $alpha: 0.3);
}

.ico__details {
  margin-top: 15px;
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.button--ico {
  width: 150px;
}

#active_green {
  color: green;
}
#unactive_red {
  color:red;
}
</style>
