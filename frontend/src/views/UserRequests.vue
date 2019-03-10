<template>
  <div class="home">
    <div class="title">Lending Requests</div>
    <hr class="separator">
    <hr class="separator">
    <UserRequests/>
  </div>
</template>

<script>
import UserRequests from '@/components/RequestManagement/LendingRequests/userLendingRequests'

export default {
  components: {
    UserRequests
  },
  data() {
    return {}
  }
}
</script>


<style lang="scss">
.home {
  text-align: center;
}
</style>
