<template>
  <div class="ico">
    <div class="title">ICO Management</div>
    <hr>
    <div class="ico__details">
      <h3>
        <div>
          <p v-if="isIcoActive" class="active_green">ICO is active</p>
          <p v-else class="inactive_red">ICO ist not active</p>
        </div>
      </h3>
      <div class="ico__details__text">{{ "Total TrustToken: " + totalTokenSupply+" "+tokenSymbol}}</div>
      <div
        class="ico__details__text"
      >{{ "Contract Balance/Goal: " + contractEtherBalance + "/"+icoGoal + " Ether"}}</div>
      <div class="ico__details__text">{{ "You own: "+ tokenBalanceUser +" "+tokenSymbol}}</div>
      <div class="ico__details__text">{{ "You have already invested: "+ etherBalanceUser +" Ether"}}</div>
      <div class="ico__details__text">{{ "Participants count: " + icoParticipantCount}}</div>
    </div>
    <hr>

    <div v-if="isIcoActive">
      <div class="ico__subtitle">{{ "Buy TrustToken"}}</div>
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
      <div class="ico__subtitle">{{"Send "+ tokenSymbol +" to "}}</div>
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

      <div
        class="ico__subtitle"
      >{{"Approve another account to use a certain amount of "+tokenSymbol+" from your account"}}</div>
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

      <div
        class="ico__subtitle"
      >{{"Send "+tokenSymbol+" to an account in the name of another account"}}</div>
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

      <div class="ico__subtitle">{{"Token amount of address, you are allowed to spend"}}</div>
      <div
        class="ico__subsubtitle"
      >{{"You are allowed to spend "+ tokenAmountAllowsToSpend +" "+ tokenSymbol+ " from entered account"}}</div>
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
import ChartDoughnut from './chart-doughnut'
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
    decimals: state => state.icoState.decimals
  }),
  data() {
    return {
      input_1: null,
      etherAmount: null,
      transferTo: null,
      transferTokenAmount: null,
      approveTokenAmount: null,
      approveSpender: null,
      transferTokenAmountFrom: null,
      transferFrom: null,
      transferFromTo: null,
      tokenAmountAllowsToSpend: 0,
      checkAddress: null
    }
  },
  methods: {
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
      let transferAmount = await this.$store.state.web3
        .web3Instance()
        .utils.toWei(this.transferTokenAmount, 'ether')
      await this.$store.state
        .icoContractInstance()
        .methods.transfer(this.transferTo, transferAmount)
        .send({
          from: this.$store.state.web3.coinbase
        })
    },
    async approve() {
      let transferAmount = await this.$store.state.web3
        .web3Instance()
        .utils.toWei(this.approveTokenAmount, 'ether')
      await this.$store.state
        .icoContractInstance()
        .methods.approve(this.approveSpender, transferAmount)
        .send({
          from: this.$store.state.web3.coinbase
        })
    },
    async transferFromMethod() {
      let transferAmount = await this.$store.state.web3
        .web3Instance()
        .utils.toWei(this.transferTokenAmountFrom, 'ether')
      await this.$store.state
        .icoContractInstance()
        .methods.transferFrom(
          this.transferFrom,
          this.transferFromTo,
          transferAmount
        )
        .send({
          from: this.$store.state.web3.coinbase
        })
    },
    async checkAllowance() {
      this.tokenAmountAllowsToSpend = await this.$store.state.web3
        .web3Instance()
        .utils.fromWei(
          await this.$store.state
            .icoContractInstance()
            .methods.allowance(
              this.checkAddress,
              this.$store.state.web3.coinbase
            )
            .call(),
          'ether'
        )
    }
  },
  mounted() {
    this.$store.dispatch(INIT_ICO_CONTRACT)
  }
}
</script>

<style lang="scss">
@import './Ico.scss';
</style>
