<template>
  <div>
    <ul class="navbar">
      <li class="navbar__icon">
        <img src="@/assets/menu.svg" @click="toggleSidebar">
      </li>
      <li class="navbar__title">
        <span class="navbar__title--first">p2p</span>
        <span class="navbar__title--second">Lending</span>
      </li>
      <li class="navbar__right">
        <span class="navbar__right--auth" v-if="!tokenHolder && !boardMember" @click="logIn">LogIn</span>
        <span class="navbar__right--auth" v-if="tokenHolder || boardMember" @click="logOut">
          <router-link :to="{ name: 'home' }" class="navbar__right--link">LogOut</router-link>
        </span>
      </li>
      <li class="navbar__right navbar__right--network" v-if="network !== null">
        <span>{{ network }}</span>
      </li>
      <li class="navbar__right">
        <span class="navbar__right--metamaskActive" v-if="isInjected">Connected</span>
        <span class="navbar__right--metamaskInactive" v-if="!isInjected">Connected</span>
      </li>
    </ul>
    <div class="routerview__slotted">
      <slot name="sidebar">
        <slot name="sidebar-overlay"></slot>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { NETWORKS } from '@/util/constants/networks'
import { AUTHENTICATE, LOGOUT } from '@/util/constants/types'

export default {
  computed: mapState({
    isInjected: state => state.web3.isInjected,
    network: state => NETWORKS[state.web3.networkID],
    tokenHolder: state => state.tokenHolder,
    boardMember: state => state.boardMember
  }),
  methods: {
    toggleSidebar() {
      this.$parent.$emit('toggleSidebar')
    },
    logIn() {
      this.$store.dispatch(AUTHENTICATE)
    },
    logOut() {
      this.$store.dispatch(LOGOUT)
    }
  }
}
</script>

<style lang="scss">
@import '@/components/Navbar/navbar.scss';
</style>
