<template>
  <div class="transferFrom">
    <div class="input-group transferFrom__origin">
      <input
        type="text"
        id="transferFrom__origin"
        class="form-control"
        v-model="origin"
        v-bind:class="{
          hasContent: origin.length > 0,
          invalidInput: invalidOrigin,
        }"
      />
      <label for="transferFrom__origin">Origin Address</label>
    </div>
    <div class="input-group transferFrom__recipient">
      <input
        type="text"
        id="transferFrom__recipient"
        class="form-control"
        v-model="recipient"
        v-bind:class="{
          hasContent: recipient.length > 0,
          invalidInput: invalidRecipient,
        }"
      />
      <label for="transferFrom__recipient">Recipient Address</label>
    </div>
    <div class="input-group transferFrom__amount">
      <input
        type="number"
        min="1"
        onkeydown="return event.keyCode !== 69"
        id="transferFrom__amount"
        class="form-control"
        v-model="amount"
        v-bind:class="{ hasContent: amount, invalidInput: invalidAmount }"
      />
      <label for="transferFrom__amount">Transfer Amount</label>
    </div>
    <div class="transferFrom__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="transfer">Transfer</div>
    </div>
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'
export default {
  data() {
    return {
      origin: '',
      recipient: '',
      amount: null,
      invalidOrigin: false,
      invalidRecipient: false,
      invalidAmount: false,
    }
  },
  methods: {
    async transfer() {
      const transferFromReturn = await ICOService.transferFrom(
        this.amount,
        this.origin,
        this.recipient
      )
      // update error states
      this.invalidAmount = transferFromReturn.invalidAmount
      this.invalidOrigin = transferFromReturn.invalidOrigin
      this.invalidRecipient = transferFromReturn.invalidRecipient
      // reset input on success
      if (
        !(this.invalidOrigin || this.invalidRecipient || this.invalidAmount)
      ) {
        this.reset()
      }
    },
    reset() {
      this.origin = ''
      this.recipient = ''
      this.amount = null
    },
  },
  watch: {
    origin() {
      this.invalidOrigin = false
    },
    recipient() {
      this.invalidRecipient = false
    },
    amount() {
      this.invalidAmount = false
    },
  },
}
</script>

<style lang="scss">
.transferFrom {
  display: grid;
  grid-template-rows: repeat(4, minmax(80px, 10vh));

  &__origin {
    grid-row: 1;
  }

  &__recipient {
    grid-row: 2;
  }

  &__amount {
    grid-row: 3;
  }

  &__buttons {
    grid-row: 4;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
  }
}
</style>
