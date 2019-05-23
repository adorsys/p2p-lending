<template>
  <div class="userRequests">
    <div class="x-large">Your Open Requests</div>
    <div class="lead">Debitor for the following requests:</div>
    <AskerRequests />
    <div class="lead">Lender for the following requests:</div>
    <LenderRequests />
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
