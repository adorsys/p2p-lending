<template>
  <div class="fee">
    <p v-if="contractFee != null" id="showFee">
      Current Contract Fee is
      <b>{{contractFee}}</b> wei
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'fee',
  computed: mapState({
    contractFee: state => state.contractFee
  })
}
</script>

<style scoped>
</style>
