<template>
  <div>
    <div class="content">
      <slot name="router-view"></slot>
    </div>
    <transition>
      <div class="sidebar" v-if="isShowing">
        <ul class="sidebar__menu">
          <li class="sidebar__menu--title">Navigation</li>
          <li class="sidebar__menu--link sidebar__menu--firstlink" @click="isShowing = false">
            <router-link
              :to="{ name: 'home' }"
              class="sidebar__menu--router sidebar__menu--firstItem"
            >Lending Requests</router-link>
          </li>
          <li class="sidebar__menu--link" @click="isShowing = false">
            <router-link :to="{ name: 'userrequests' }" class="sidebar__menu--router">User Requests</router-link>
          </li>
          <li
            class="sidebar__menu--link"
            v-if="this.$store.state.tokenHolder || this.$store.state.boardMember"
            @click="isShowing = false"
          >
            <router-link
              :to="{ name: 'p2pManagement' }"
              class="sidebar__menu--router"
            >p2p-Management</router-link>
          </li>
          <li class="sidebar__menu--link" @click="isShowing = false">
            <router-link :to="{ name: 'ico' }" class="sidebar__menu--router">ICO</router-link>
          </li>
          <li class="sidebar__menu--link" @click="isShowing = false">
            <router-link :to="{ name: 'about' }" class="sidebar__menu--router">About</router-link>
          </li>
        </ul>
      </div>
    </transition>
    <transition>
      <div class="sidebar__overlay" v-if="isShowing" @click="$parent.$emit('toggleSidebar')"></div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowing: false
    }
  },
  mounted() {
    this.$parent.$on('toggleSidebar', () => {
      this.isShowing = !this.isShowing
    })
  }
}
</script>

<style lang="scss">
@import '@/components/Sidebar/sidebar.scss';
</style>
