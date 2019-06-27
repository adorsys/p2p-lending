<template>
  <div class="errorContent" v-if="!isInjected">
    <div class="card card--twoRows">
      <div class="card__title-section">
        <div class="title">Install MetaMask</div>
        <div class="subtitle">Please install MetaMask to use our service</div>
      </div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://metamask.io/"
        class="btn"
        >Install now</a
      >
    </div>
  </div>
  <div class="errorContent" v-else>
    <div class="card card--oneRow">
      <div class="card__title-section">
        <div class="title">Invalid Network</div>
        <div class="subtitle">
          Please connect to
          <strong>{{ currentNetwork }}</strong> to use our service
        </div>
      </div>
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
