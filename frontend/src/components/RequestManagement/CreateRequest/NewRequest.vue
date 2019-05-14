<template>
  <div class="newRequest">
    <div class="newRequest__input-group">
      <input
        type="text"
        id="newRequest__asked"
        class="newRequest__form-control"
        v-model="credit"
        v-bind:class="{ hasContent: credit.length > 0 }"
      />
      <label for="newRequest__asked">Credit</label>
    </div>
    <div class="newRequest__input-group">
      <input
        type="text"
        id="newRequest__payback"
        class="newRequest__form-control"
        v-model="payback"
        v-bind:class="{ hasContent: payback.length > 0 }"
      />
      <label for="newRequest__payback">Payback</label>
    </div>
    <div class="newRequest__input-group">
      <input
        type="text"
        id="newRequest__description"
        class="newRequest__form-control"
        v-model="description"
        v-bind:class="{ hasContent: description.length > 0 }"
      />
      <label for="newRequest__description">Description</label>
    </div>
    <div class="error" v-bind:class="{ displayError: error }">
      {{ errorMsg }}
    </div>
    <div class="newRequest__buttons">
      <div class="btn btn--light" @click="submit">Submit</div>
      <div class="btn btn--light" @click="reset">Reset</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['contract'],
  data() {
    return {
      credit: '',
      payback: '',
      description: '',
      errorMsg: 'Invalid Input',
      error: false,
    }
  },
  methods: {
    async submit() {
      this.error = false
      const paybackAmount = parseFloat(this.payback)
      const askAmount = parseFloat(this.credit)

      if (
        this.credit.length > 0 &&
        this.payback.length > 0 &&
        this.description.length > 0 &&
        paybackAmount > askAmount &&
        askAmount > 0
      ) {
        const creditInWei = this.$store.state.web3
          .web3Instance()
          .utils.toWei(this.credit, 'Ether')
        const paybackInWei = this.$store.state.web3
          .web3Instance()
          .utils.toWei(this.payback, 'Ether')
        await this.contract()
          .methods.ask(creditInWei, paybackInWei, this.description)
          .send({ from: this.$store.state.web3.coinbase })
        this.reset()
      } else {
        this.error = true
      }
    },
    reset() {
      this.credit = ''
      this.payback = ''
      this.description = ''
      this.error = false
    },
  },
}
</script>

<style lang="scss">
@import 'NewRequest';
</style>
