<template>
  <div class="createRequest">
    <NewRequest :contract="requestManagement" />
  </div>
</template>

<script>
import NewRequest from '@/components/RequestManagement/CreateRequest/NewRequest'
import { mapState } from 'vuex'
export default {
  name: 'CreateRequest',
  components: {
    NewRequest
  },
  computed: mapState({
    requestManagement: state => state.requestManagementInstance
  })
}
</script>
