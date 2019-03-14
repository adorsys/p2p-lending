<template>
  <div>
    <div class="subtitle">Change Contract Fee</div>
    <div class="contractFee">
      <label
        for="contractFee__input--contractFee"
        class="contractFee__label contractFee__label--contractFee"
      >Proposed Fee:</label>
      <input
        type="text"
        id="contractFee__input--contractFee"
        class="contractFee__inputField contractFee__inputField--contractFee"
        placeholder="0.0 ETH"
        v-model="proposedFee"
      >
      <div class="button button--contractFee">Change Fee</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      proposedFee: null
    }
  }
}
</script>
