<template>
  <nav class="navbar bg-light">
    <div>
      <router-link
        :to="{ name: 'home' }"
        class="navbar__link navbar__link--title"
        >p2pLending</router-link
      >
    </div>
    <div
      class="navbar__link"
      @click="logIn"
      v-if="!active && !boardMember && !tokenHolder"
      >LogIn</div
    >
    <div
      class="navbar__link"
      @click="logOut"
      v-if="!active && (boardMember || tokenHolder)"
      >LogOut</div
    >
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('web3', ['tokenHolder', 'boardMember']),
    ...mapState('ico', ['active']),
  },
  methods: {
    ...mapActions('web3', ['login', 'logout']),
    logIn() {
      this.login()
    },
    logOut() {
      this.logout()
    },
  },
}
</script>

<style lang="scss">
@import '@/components/Navbar/navbar.scss';
</style>
