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
            >Home</router-link>
          </li>
          <li class="sidebar__menu--link" @click="isShowing = false">
            <router-link :to="{ name: 'lendingboard' }" class="sidebar__menu--router">Lending Board</router-link>
          </li>
          <li class="sidebar__menu--router" @click="isShowing = false">
            <router-link :to="{ name: 'ico' }" class="sidebar__menu--router">ICO</router-link>
          </li>
          <li class="sidebar__menu--router">
            <router-link :to="{ name: 'about' }" class="sidebar__menu--router">About</router-link>
          </li>
        </ul>
      </div>
    </transition>
    <transition>
      <div class="sidebar__overlay" v-if="isShowing"></div>
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
