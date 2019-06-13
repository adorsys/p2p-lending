<template>
  <div class="icoInvest card card--icoDetails">
    <div class="icoInvest__title">Buy TrustToken</div>
    <div class="input-group icoInvest__input">
      <input
        type="text"
        onkeydown="return (/^[0-9.]$/.test(event.key) ||
          event.key === 'Backspace')"
        id="invest__amount"
        class="form-control"
        v-model="amount"
        v-bind:class="{ hasContent: amount.length > 0, invalidInput: error }"
      />
      <label for="invest__amount">Amount to Invest (ETH)</label>
    </div>
    <div class="icoInvest__button btn btn--form" @click="submit">Buy</div>
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'

export default {
  data() {
    return {
      amount: '',
      error: false,
    }
  },
  methods: {
    async submit() {
      this.error = !(await ICOService.invest(this.amount))
      if (!this.error) {
        this.amount = ''
      }
    },
  },
  watch: {
    amount() {
      this.error = false
    },
  },
}
</script>

<style lang="scss">
@import 'ICOInvest';
</style>
