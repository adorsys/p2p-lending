<template>
  <div class="createLendingRequest">
    <div class="subtitle subtitle--lendingRequest">Create Lending Request</div>
    <div
      class="button button--lendingRequest"
      @click="$emit('openRequestOverlay')"
    >Create Lending Request</div>
    <slot/>
  </div>
</template>
