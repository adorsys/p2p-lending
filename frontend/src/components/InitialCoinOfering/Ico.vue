<template>
  <div class="ico">
    <h1>ICO Management</h1>
    <input
      type="text"
      name="ico__input-1"
      id="ico__input-1"
      class="ico__input"
      v-model="input_1"
      placeholder="input-1"
    >
    <div class="button button--ico" @click="submit">Submit</div>
    <div class="button button--ico" @click="receive">Receive</div>
    <h3>{{ "ICO active: " +  isIcoActive}}</h3>
    <h3>{{ "Total TrustToken: " +  totalTokenSupply}}</h3>
    <h3>{{ "You own: "+ tokenBalanceUser +" "+tokenSymbol}}</h3>
    <h3>{{ "Participants count: " +  icoParticipantCount}}</h3>
    <h3>{{ "Contract Blance/Goal: " + contractEtherBalance + "/"+icoGoal }}</h3>
    <h3>{{ "Buy TrustToken"}}</h3>
    <input
      type="text"
      name="ico__input-1"
      id="ico__input-1"
      class="ico__input"
      v-model="etherAmount"
      placeholder="Ether"
    >
    <div class="button button--ico" @click="buyToken">Buy</div>



    
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: 
  
  mapState({
    icoGoal: state => state.icoState.icoGoal,
    contractEtherBalance: state => state.icoState.icoEtherBalance,
    isIcoActive: state => state.icoState.isIcoActive,
    totalTokenSupply : state => state.icoState.totalTokenSupply,
    icoParticipantCount : state => state.icoState.icoParticipantCount,    
    tokenSymbol : state => state.icoState.tokenSymbol,
    tokenBalanceUser: state => state.icoState.tokenBalanceUser
  }
  ),
  showAccount: function() {
      
     getTokenBlanceUser()
    },
  data() {
    return {
      input_1: null,
      etherAmount: null
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
      console.log(await web3.eth)    

      
    },
    async buyToken() {
      await this.$store.state
        .icoContractInstance()
        .methods.participate()
        .send({ from: this.$store.state.web3.coinbase ,
                value: this.$store.state.web3.web3Instance().utils.toWei(this.etherAmount, "ether")})
    },
  

  }
}

</script>

<style lang="scss" scoped>
$navbar-background-color: #dadada;
$navbar-hover-color: #f3f3f3;
$navbar-height: 44px;

$background-color: #dadada;
$background-color-inactive: #e7e7e7;

$padding-standard: 7px;

$border-color: #a0a0a0;
$border-width: 2px;

$link-text-color: #666;
$link-text-color-darkened: #444;

.ico__input {
  padding: 0.7em;
  background-color: $navbar-hover-color;
  border: 2px solid rgba($color: $border-color, $alpha: 0.3);
}

.button {
  all: unset;
  display: inline-block;
  margin-top: 25px;
  margin-right: 0.5em;
  margin-bottom: 25px;
  margin-left: 0.5em;
  padding: 0.5em 1.25em;
  width: 70px;
  cursor: pointer;
  background: $navbar-background-color;
  color: $link-text-color-darkened;
  border: 1px solid rgba($color: $border-color, $alpha: 0.3);
  border-radius: 2px;
  box-shadow: 0 0px 12px -6px rgba($color: #000000, $alpha: 0.3);
  font-weight: 600;
}

.button--ico {
  width: 150px;
}
</style>
