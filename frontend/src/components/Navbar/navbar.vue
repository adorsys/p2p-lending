<template>
  <nav class="navbar">
    <div class="navbar__logo">
      <h4>p2plending</h4>
    </div>
    <ul
      class="navbar__links"
      v-bind:class="{
        'navbar__links--active': navOpen,
        'navbar__links--loggedIn': loggedIn
      }"
    >
      <li class="navbar__link-container" @click="closeSlider">
        <router-link
          :to="{ name: 'home' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >Home</router-link
        >
      </li>
      <li class="navbar__link-container" @click="closeSlider">
        <router-link
          :to="{ name: 'requests' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >Requests</router-link
        >
      </li>
      <li class="navbar__link-container" @click="closeSlider" v-if="loggedIn">
        <router-link
          :to="{ name: 'p2pManagement' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >Management</router-link
        >
      </li>
      <li class="navbar__link-container" @click="closeSlider" v-if="icoActive">
        <router-link
          :to="{ name: 'ico' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >ICO</router-link
        >
      </li>
      <li class="navbar__link-container" @click="closeSlider" v-if="!loggedIn">
        <div class="navbar__authenticate" @click="logIn">LogIn</div>
      </li>
      <li class="navbar__link-container" @click="closeSlider" v-if="loggedIn">
        <div class="navbar__authenticate" @click="logOut">LogOut</div>
      </li>
    </ul>
    <div class="navbar__burger" @click="openSlider">
      <div class="burger__line"></div>
      <div class="burger__line"></div>
      <div class="burger__line"></div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import { AUTHENTICATE, LOGOUT } from '@/util/constants/types'

export default {
  computed: mapState({
    tokenHolder: state => state.tokenHolder,
    boardMember: state => state.boardMember,
    icoActive: state => state.icoState.isIcoActive
  }),
  data() {
    return {
      navOpen: false,
      loggedIn: false
    }
  },
  methods: {
    openSlider() {
      if (this.navOpen) {
        // close slider
        this.navOpen = false
        // reset animation for all elements
        document.querySelectorAll('.navbar__link-container').forEach(link => {
          link.style.animation = ''
        })
        this.$emit('toggleSidebar')
      } else {
        this.navOpen = true
        document
          .querySelectorAll('.navbar__link-container')
          .forEach((link, index) => {
            if (link.style.animation) {
              link.style.animation = ''
            } else {
              link.style.animation = `navLinkFade 0.5s ease forwards ${index /
                7 +
                0.5}s`
            }
          })
        this.$emit('toggleSidebar')
      }
    },
    closeSlider() {
      if (this.navOpen) {
        // close slider
        this.navOpen = false
        // reset animation for all elements
        document.querySelectorAll('.navbar__link-container').forEach(link => {
          link.style.animation = ''
        })
        this.$emit('toggleSidebar')
      }
    },
    logIn() {
      this.$store.dispatch(AUTHENTICATE)
    },
    logOut() {
      this.$router.push({ name: 'home' })
      this.$store.dispatch(LOGOUT)
      this.loggedIn = false
    }
  },
  watch: {
    tokenHolder: {
      handler: function(tHolder) {
        if (tHolder && !this.loggedIn) {
          this.loggedIn = true
        }
      }
    },
    boardMember: {
      handler: function(bMember) {
        if (bMember && !this.loggedIn) {
          this.loggedIn = true
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/components/Navbar/navbar.scss';
</style>
