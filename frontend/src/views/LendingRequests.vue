<template>
  <div class="lendingRequests">
    <div class="x-large">LendingRequests</div>
    <section class="lendingRequests__content">
      <OpenRequests />
    </section>
  </div>
</template>

<script>
import OpenRequests from '../components/RequestManagement/LendingRequests/OpenRequests'
export default {
  components: {
    OpenRequests,
  },
}
</script>
