<template>
  <div>
    <slot></slot>
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
            <router-link :to="{ name: 'about' }" class="router-link">About</router-link>
          </li>
        </ul>
      </nav>
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

<style lang="scss" scoped>
@import '@/components/Sidebar/sidebar.scss';
</style>
