<template>
  <div>
    <slot name="router-view"></slot>
    <transition>
      <nav class="nav-left" v-if="isShowing">
        <ul>
          <li class="title">Navigation</li>
          <li class="link">
            <router-link :to="{ name: 'home' }" class="router-link" style="margin-top: 14px">Home</router-link>
          </li>
          <li class="link">
            <router-link :to="{ name: 'lendingboard' }" class="router-link">Lending Board</router-link>
          </li>
          <li class="link">
            <router-link :to="{ name: 'ico' }" class="router-link">ICO</router-link>
          </li>
          <li class="link">
            <router-link :to="{ name: 'about' }" class="router-link">About</router-link>
          </li>
        </ul>
        <SidebarOverlay slot="sidebar-overlay"/>
      </nav>
    </transition>
  </div>
</template>

<script>
import SidebarOverlay from '@/components/Sidebar/sidebar-overlay'
export default {
  components: {
    SidebarOverlay
  },
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

<style lang="scss" scoped>
@import '@/components/Sidebar/sidebar.scss';
</style>
