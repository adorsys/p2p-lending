<template>
  <div class="transfer">
    <div class="input-group transfer__recipient">
      <input
        type="text"
        id="transfer__recipient"
        class="form-control"
        v-model="recipient"
        v-bind:class="{
          hasContent: recipient.length > 0,
          invalidInput: invalidRecipient,
        }"
      />
      <label for="transfer__recipient">Recipient Address</label>
    </div>
    <div class="input-group transfer__amount">
      <input
        type="number"
        min="1"
        onkeydown="return event.keyCode !== 69"
        id="transfer__amount"
        class="form-control"
        v-model="amount"
        v-bind:class="{ hasContent: amount, invalidInput: invalidAmount }"
      />
      <label for="transfer__amount">Transfer Amount</label>
    </div>
    <div class="transfer__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="submit">Transfer</div>
    </div>
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'
export default {
  data() {
    return {
      recipient: '',
      amount: null,
      invalidRecipient: false,
      invalidAmount: false,
    }
  },
  methods: {
    async submit() {
      const transferReturn = await ICOService.transfer(
        this.amount,
        this.recipient
      )
      // update error states
      this.invalidAmount = transferReturn.invalidAmount
      this.invalidRecipient = transferReturn.invalidRecipient
      // reset input on success
      if (!(this.invalidRecipient || this.invalidAmount)) {
        this.reset()
      }
    },
    reset() {
      this.recipient = ''
      this.amount = null
    },
  },
  watch: {
    amount() {
      this.invalidAmount = false
    },
    recipient() {
      this.invalidRecipient = false
    },
  },
}
</script>

<style lang="scss">
.transfer {
  display: grid;
  grid-template-rows: repeat(3, minmax(80px, 10vh));

  &__recipient {
    grid-row: 1;
  }

  &__amount {
    grid-row: 2;
  }

  &__buttons {
    grid-row: 3;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
  }
}
</style>
