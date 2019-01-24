<template>
  <ul>
    <li class="icon">
      <img src="@/assets/menu.svg" @click="toggleSidebar">
    </li>
    <li class="title">
      <router-link :to="{ name: 'home' }" id="title">
        <span id="firstpart">P2P</span>
        <span id="secondpart">Lending</span>
      </router-link>
    </li>

    <li class="account" v-if="authenticated === true" @click="logOut">
      <router-link :to="{ name: 'about' }" class="router-link">LogOut</router-link>
    </li>
    <li class="account" v-if="authenticated !== true" @click="logIn">
      <router-link :to="{ name: 'about' }" class="router-link">LogIn</router-link>
    </li>
    <li class="network" v-if="network !== null">
      <span>{{ network }}</span>
    </li>
    <li class="balance" v-if="balance !== null">
      <span>{{ balance }}</span>
      <span id="eth">ETH</span>
    </li>
    <li class="has-metamask" v-if="isInjected">Connected</li>
    <li class="has-no-metamask" v-if="!isInjected">Connected</li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'

import { NETWORKS } from '@/util/constants/networks'

export default {
  computed: mapState({
    isInjected: state => state.web3.isInjected,
    balance: state => state.web3.balance,
    network: state => NETWORKS[state.web3.networkID]
  }),
  data() {
    return {
      authenticated: false
    }
  },
  methods: {
    toggleSidebar() {
      this.$parent.$emit('toggleSidebar')
    },
    logIn() {
      console.log('login')
      this.authenticated = true
    },
    logOut() {
      console.log('logout')
      this.authenticated = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/components/Navbar/navbar.scss';
</style>
