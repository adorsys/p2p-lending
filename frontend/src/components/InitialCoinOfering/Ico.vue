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
      <h3>{{ "Total TrustToken: " + totalTokenSupply}}</h3>
      <h3>{{ "Contract Balance/Goal: " + contractEtherBalance + "/"+icoGoal + " Ether"}}</h3>
      <h3>{{ "You own: "+ tokenBalanceUser +" "+tokenSymbol}}</h3>
      <h3>{{ "You have already invested: "+ etherBalanceUser +" Ether"}}</h3>
      <h3>{{ "Participants count: " + icoParticipantCount}}</h3>
    </div>
    <hr>
    
    <div v-if="isIcoActive">
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

        <ChartDoughnut/>
    </div>
    
    <div v-else>            
        <h3 >{{"Send "+ name +" to "}}</h3>
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="tokenAmount"
          placeholder="TrustToken"
        >
        <input
          type="text"
          name="ico__input-1"
          id="ico__input-1"
          class="ico__input"
          v-model="transferTo"
          placeholder="address"
        >
        <div class="button button--ico" @click="transfer">Send</div>
        <hr>
        <h3 >{{"Send "+ name +" to "}}</h3>


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
    name: state => state.icoState.name
  }),
  data() {
    return {
      input_1: null,
      etherAmount: null,
      transferTo: null,
      from: null,
      tokenAmount: null
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
    async buyToken() {
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
      await this.$store.state
        .icoContractInstance()
        .methods.transfer(this.transferTo , (parseInt(this.tokenAmount, 10)))
        .send({
          from: this.$store.state.web3.coinbase
        })
    }
  },
  async mounted() {
    await this.$store.dispatch(INIT_ICO_CONTRACT)
    this.$emit('loaded')
  }
}
</script>

<style lang="scss" scoped>
// variables
$navbar-background-color: #dadada;
$navbar-hover-color: #f3f3f3;
$border-color: #a0a0a0;
$link-text-color-darkened: #444;

.ico__input {
  padding: 0.7em;
  background-color: $navbar-hover-color;
  border: 2px solid rgba($color: $border-color, $alpha: 0.3);
}

.ico__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

#active_green {
  color: green;
}
#unactive_red {
  color:red;
}
</style>
