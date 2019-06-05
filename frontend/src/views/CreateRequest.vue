<template>
  <div class="createRequest">
    <div class="x-large">Create Request</div>
    <section class="createRequest__content">
      <NewRequest />
    </section>
  </div>
</template>

<script>
import NewRequest from '../components/RequestManagement/CreateRequest/NewRequest'
export default {
  name: 'CreateRequest',
  components: {
    NewRequest,
  },
}
</script>
