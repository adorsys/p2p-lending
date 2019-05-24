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
      @click="login"
      v-if="isInjected && !active && !(boardMember || tokenHolder)"
      >LogIn</div
    >
    <div
      class="navbar__link"
      @click="logout"
      v-if="isInjected && !active && (boardMember || tokenHolder)"
      >LogOut</div
    >
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('auth', ['tokenHolder', 'boardMember', 'isInjected']),
    ...mapState('ico', ['active']),
  },
  methods: {
    ...mapActions('auth', ['logIn', 'logOut']),
    login() {
      this.logIn()
    },
    logout() {
      this.logOut()
    },
  },
}
</script>

<style lang="scss">
@import '@/components/Navbar/navbar.scss';
</style>
