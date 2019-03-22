<template>
  <div class="icoManagement">
    <div class="subtitle subtitle--icoManagement">Transfer TrustToken</div>
    <div class="userInput userInput--transferToken">
      <label
        for="userInput__inputField--transferToken"
        class="userInput__label userInput__label--transferToken"
      >TrustToken to send:</label>
      <input
        type="text"
        id="userInput__inputField--transferToken"
        class="userInput__inputField userInput__inputField--transferToken"
        placeholder="Amount in [0...x]"
      >
      <div class="button button--transferToken">Transfer</div>
    </div>
    <hr class="separator">
    <div class="subtitle subtitle--icoManagement">Approve User to use your TrustToken</div>
    <div class="userInput userInput--approveTransfer">
      <label
        for="userInput__inputField--approveAddress"
        class="userInput__label userInput__label--approveAddress"
      >Address to approve:</label>
      <label
        for="userInput__inputField--approveAmount"
        class="userInput__label userInput__label--approveAmount"
      >Amount to provide:</label>
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
      <div class="button button--approveUser">Approve</div>
    </div>
    <hr class="separator">
    <div class="subtitle subtitle--icoManagement">Spend TrustToken for another account</div>
    <div class="userInput userInput--transferFor">
      <label
        for="userInput__inputField--transferFrom"
        class="userInput__label userInput__label--transferFrom"
      >Transfer From:</label>
      <label
        for="userInput__inputField--transferTo"
        class="userInput__label userInput__label--transferTo"
      >Transfer To:</label>
      <label
        for="userInput__inputField--transferAmount"
        class="userInput__label userInput__label--transferAmount"
      >Amount to transfer:</label>
      <input
        type="text"
        id="userInput__inputField--transferFrom"
        class="userInput__inputField userInput__inputField--transferFrom"
        placeholder="Transfer from address"
      >
      <input
        type="text"
        id="userInput__inputField--transferTo"
        class="userInput__inputField userInput__inputField--transferTo"
        placeholder="Transfer to address"
      >
      <input
        type="text"
        id="userInput__inputField--transferAmount"
        class="userInput__inputField userInput__inputField--transferAmount"
        placeholder="Transfer Amount"
      >
      <div class="button button--transferFrom">Transfer</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss">
@import './icoManagement';
</style>
