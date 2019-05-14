<template>
  <nav class="navbar bg-light">
    <div>
      <router-link
        :to="{ name: 'home' }"
        class="navbar__link navbar__link--title"
        >p2pLending</router-link
      >
    </div>
    <!-- <ul class="navbar__link-container"> -->
    <div
      class="navbar__link"
      @click="logIn"
      v-if="!icoActive && !boardMember && !tokenHolder"
    >
      LogIn
    </div>
    <div
      class="navbar__link"
      @click="logOut"
      v-if="!icoActive && (boardMember || tokenHolder)"
    >
      LogOut
    </div>
    <!-- </ul> -->
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import { AUTHENTICATE, LOGOUT } from '@/util/constants/types'

export default {
  computed: mapState({
    tokenHolder: (state) => state.tokenHolder,
    boardMember: (state) => state.boardMember,
    icoActive: (state) => state.icoState.isIcoActive,
  }),
  data() {
    return {
      loggedIn: false,
    }
  },
  methods: {
    logIn() {
      this.$store.dispatch(AUTHENTICATE)
    },
    logOut() {
      this.$router.push({ name: 'home' })
      this.$store.dispatch(LOGOUT)
      this.loggedIn = false
    },
  },
  watch: {
    tokenHolder: {
      handler: function(tHolder) {
        if (tHolder && !this.loggedIn) {
          this.loggedIn = true
        }
      },
    },
    boardMember: {
      handler: function(bMember) {
        if (bMember && !this.loggedIn) {
          this.loggedIn = true
        }
      },
    },
  },
}
</script>

<style lang="scss">
@import '@/components/Navbar/navbar.scss';
</style>
