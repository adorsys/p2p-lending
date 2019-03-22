<template>
  <div class="icoManagement">
    <div class="userInput userInput--icoManagement">
      <label
        for="userInput__inputField--transferToken"
        class="userInput__label userInput__label--transferToken"
      >Transfer {{ tokenSymbol }} to:</label>
      <label
        for="userInput__inputField--approveAddress"
        class="userInput__label userInput__label--approve"
      >Approve account to use some of your {{ tokenSymbol }}</label>
      <input
        type="text"
        id="userInput__inputField--transferToken"
        class="userInput__inputField userInput__inputField--transferToken"
        placeholder="Amount in [0...x]"
      >
      <input
        type="text"
        id="userInput__inputField--approveAddress"
        class="userInput__inputField userInput__inputField--approveAddress"
        placeholder="Address of User"
      >
      <input
        type="text"
        id="userInput__inputField--approveAmount"
        class="userInput__inputField userInput__inputField--approveAmount"
        placeholder="Amount in [0...x]"
      >
      <div class="button button--transferToken">Transfer</div>
      <div class="button button--approveUser">Approve</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    tokenSymbol: state => state.icoState.tokenSymbol
  }),
  data() {
    return {}
  }
}
</script>

<style lang="scss">
@import './icoManagement';
</style>
