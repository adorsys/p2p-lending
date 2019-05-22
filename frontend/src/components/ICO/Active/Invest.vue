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
    <div class="btn btn--light invest__button" @click="submit">Invest</div>
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
  },
  watch: {
    amount() {
      this.error = false
    },
  },
}
</script>

<style lang="scss">
.invest {
  display: grid;
  grid-template-columns: auto 40vw auto;
  grid-template-rows: repeat(2, 10vh);
  align-items: center;

  &__input {
    grid-column: 2;
    grid-row: 1;
    width: 100%;
  }

  &__button {
    margin: 0;
    grid-column: 2;
    grid-row: 2;
    justify-self: end;
  }
}
</style>
