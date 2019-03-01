<template>
  <div class="home">
    <div class="title">Lending Requests</div>
    <hr class="separator">
    <hr class="separator">
    <Requests/>
  </div>
</template>

<script>
import Requests from '@/components/RequestManagement/Requests/requests'
export default {
  components: {
    Requests
  }
}
</script>


<style lang="scss">
.home {
  text-align: center;
}
</style>
