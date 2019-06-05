<template>
  <div class="invest">
    <div class="input-group invest__input">
      <input
        type="number"
        min="0"
        onkeydown="return event.keyCode !== 69"
        id="invest__amount"
        class="form-control"
        v-model="amount"
        v-bind:class="{ hasContent: amount, invalidInput: error }"
      />
      <label for="invest__amount">Investment (ETH)</label>
    </div>
    <div class="invest__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="submit">Invest</div>
    </div>
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'
export default {
  data() {
    return {
      amount: null,
      error: false,
    }
  },
  methods: {
    async submit() {
      this.error = !(await ICOService.invest(this.amount))
      if (!this.error) {
        this.amount = null
      }
    },
    async reset() {
      this.amount = null
      this.error = false
    },
  },
  watch: {
    amount() {
      this.error = false
    },
  },
}
</script>
