<template>
  <nav class="navbar">
    <div class="navbar__logo">
      <h4>p2plending</h4>
    </div>
    <ul class="navbar__links">
      <li class="navbar__link-container" @click="closeNav">
        <router-link
          :to="{ name: 'home' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >Home</router-link
        >
      </li>
      <li class="navbar__link-container" @click="closeNav">
        <router-link
          :to="{ name: 'lendingrequests' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >Requests</router-link
        >
      </li>
      <li class="navbar__link-container" @click="closeNav">
        <router-link
          :to="{ name: 'userrequests' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >UserRequests</router-link
        >
      </li>
      <li
        class="navbar__link-container"
        @click="closeNav"
        v-if="tokenHolder || boardMember"
      >
        <router-link
          :to="{ name: 'p2pManagement' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >Management</router-link
        >
      </li>
      <li class="navbar__link-container" @click="closeNav">
        <router-link
          :to="{ name: 'ico' }"
          class="navbar__link"
          exact-active-class="navbar__link--active"
          >ICO</router-link
        >
      </li>
      <li
        class="navbar__link-container"
        @click="closeNav"
        v-if="!tokenHolder && !boardMember"
      >
        <div class="navbar__authenticate" @click="logIn">LogIn</div>
      </li>
      <li
        class="navbar__link-container"
        @click="closeNav"
        v-if="tokenHolder || boardMember"
      >
        <div class="navbar__authenticate" @click="logOut">LogOut</div>
      </li>
    </ul>
    <div class="navbar__burger" @click="navSlide">
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
    boardMember: state => state.boardMember
  }),
  methods: {
    closeNav() {
      const navbarLinks = document.querySelector('.navbar__links')
      if (navbarLinks.classList.contains('navbar__links--active')) {
        // remove active class from navbar__links
        navbarLinks.classList.toggle('navbar__links--active')
        // reenable overflow
        document.querySelector('.content').classList.toggle('toggleOverflow')
        // reset link animation
        document.querySelectorAll('.navbar__links li').forEach(link => {
          link.style.animation = ''
        })
      }
    },
    navSlide() {
      // toggle sidebar
      document
        .querySelector('.navbar__links')
        .classList.toggle('navbar__links--active')
      // prevent scrolling while menu is active
      document.querySelector('.content').classList.toggle('toggleOverflow')
      // animate links
      document.querySelectorAll('.navbar__links li').forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = ''
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 +
            0.5}s`
        }
      })
    },
    logIn() {
      this.$store.dispatch(AUTHENTICATE)
    },
    logOut() {
      this.$router.push({ name: 'home' })
      this.$store.dispatch(LOGOUT)
    }
  }
}
</script>

<style lang="scss">
@import '@/components/Navbar/navbar.scss';
</style>
