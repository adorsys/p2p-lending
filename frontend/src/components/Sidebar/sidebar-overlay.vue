<template>
  <div class="sidebar-overlay"></div>
</template>

<style lang="scss" scoped>
@import '../../util/scss/variables';
.sidebar-overlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 48px;
  left: $sidebar-width + 1px;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2;
}
</style>
