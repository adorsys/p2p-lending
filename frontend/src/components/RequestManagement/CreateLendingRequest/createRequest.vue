<template>
  <div class="createLendingRequest">
    <div
      class="button button--lendingRequest"
      @click="$emit('openRequestOverlay')"
    >
      Create Request
    </div>
    <slot />
  </div>
</template>

<style lang="scss">
@import '../../../util/scss/variables';

.button--lendingRequest {
  margin: 0;
  color: $text-color-dark;
  width: 150px;
  border: 1.5px solid rgba($color: $text-color-dark, $alpha: 0.2);
}
</style>
