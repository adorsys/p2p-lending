<template>
  <div class="userRequests">
    <div class="x-large">Your Open Requests</div>
    <section class="userRequests__content">
      <div class="lead">Debitor for the following requests:</div>
      <AskerRequests />
      <div class="lead">Creditor for the following requests:</div>
      <LenderRequests />
    </section>
  </div>
</template>

<script>
import AskerRequests from '../components/RequestManagement/UserRequests/askerRequests'
import LenderRequests from '../components/RequestManagement/UserRequests/lenderRequests'

export default {
  components: {
    AskerRequests,
    LenderRequests,
  },
}
</script>

<style lang="scss">
.userRequests {
  height: 100%;
  display: grid;
  grid-template-rows: 150px auto;
  align-items: center;

  &__content {
    grid-row: 2;
    height: 100%;
    padding-top: 2rem;
  }
}
</style>
