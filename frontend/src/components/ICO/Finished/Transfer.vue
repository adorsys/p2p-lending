<template>
  <div class="transfer">
    <div class="input-group transfer__recipient">
      <input
        type="text"
        id="transfer__recipient"
        class="form-control"
        v-model="recipient"
        v-bind:class="{ hasContent: recipient.length > 0, invalidInput: error }"
      />
      <label for="transfer__recipient">Recipientaddress</label>
    </div>
    <div class="input-group transfer__amount">
      <input
        type="text"
        id="transfer__amount"
        class="form-control"
        v-model="amount"
        v-bind:class="{ hasContent: amount.length > 0, invalidInput: error }"
      />
      <label for="transfer__amount">Transferamount</label>
    </div>
    <div class="transfer__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="transfer">Transfer</div>
    </div>
  </div>
</template>

<script>
import { web3Instance } from '@/services/web3/getWeb3'

export default {
  data() {
    return {
      recipient: '',
      amount: '',
      error: false,
    }
  },
  methods: {
    async transfer() {
      this.error = false
      const web3 = web3Instance.getInstance()

      if (this.amount.length > 0 && this.recipient.length > 0 && web3) {
        try {
          const amountInWei = web3.utils.toWei(this.amount, 'ether')
        } catch (err) {
          this.error = true
        }
      }
    },
    reset() {
      this.recipient = ''
      this.amount = ''
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
