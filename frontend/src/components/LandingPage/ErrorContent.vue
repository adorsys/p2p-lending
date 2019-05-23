<template>
  <div class="errorContent" v-if="!isInjected">
    <div class="large">No Web3 Detected</div>
    <div class="lead">
      <p>
        In Firefox or Chrome you can install the Metamask extension to enable
        Web3 support.
      </p>
      <p>
        You can download Metamask
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://metamask.io/"
          class="link"
          >here</a
        >
      </p>
    </div>
  </div>
  <div class="errorContent" v-else>
    <div class="lead">
      <p>Please connect to the following network:</p>
      <p class="large">{{ currentNetwork }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('auth', ['isInjected', 'currentNetwork']),
  },
}
</script>

<style lang="scss">
.errorContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
