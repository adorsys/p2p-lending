<template>
  <div class="newRequest">
    <div class="input-group newRequest__asked">
      <input
        type="number"
        min="0"
        oninput="validity.valid||(value='');"
        id="newRequest__asked"
        class="form-control"
        v-model="credit"
        v-bind:class="{
          hasContent: credit,
          invalidInput: error,
        }"
      />
      <label for="newRequest__asked">Credit</label>
    </div>
    <div class="input-group newRequest__payback">
      <input
        type="number"
        min="0"
        oninput="validity.valid||(value='');"
        id="newRequest__payback"
        class="form-control"
        v-model="payback"
        v-bind:class="{
          hasContent: payback,
          invalidInput: error,
        }"
      />
      <label for="newRequest__payback">Payback</label>
    </div>
    <div class="input-group newRequest__description">
      <input
        type="text"
        id="newRequest__description"
        class="form-control"
        v-model="description"
        v-bind:class="{
          hasContent: description.length > 0,
          invalidInput: error,
        }"
      />
      <label for="newRequest__description">Description</label>
    </div>
    <div class="newRequest__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="submit">Submit</div>
    </div>
  </div>
</template>

<script>
import { web3Instance } from '@/services/web3/getWeb3'
export default {
  props: ['contract'],
  data() {
    return {
      credit: null,
      payback: null,
      description: '',
      error: false,
    }
  },
  methods: {
    async submit() {
      this.error = false
      const web3 = web3Instance.getInstance()

      if (
        web3 &&
        this.credit > 0 &&
        this.payback > 0 &&
        this.description.length > 0
      ) {
        try {
          const creditInWei = web3.utils.toWei(this.credit, 'ether')
          const paybackInWei = web3.utils.toWei(this.payback, 'ether')
          const user = await web3.eth.getCoinbase()
          await this.contract()
            .methods.ask(creditInWei, paybackInWei, this.description)
            .send({ from: user })
          this.reset()
        } catch (err) {
          this.error = true
        }
      } else {
        this.reset()
        this.error = true
      }
    },
    reset() {
      this.credit = null
      this.payback = null
      this.description = ''
      this.error = false
    },
  },
  watch: {
    credit() {
      this.error = false
    },
    payback() {
      this.error = false
    },
    description() {
      this.error = false
    },
  },
}
</script>

<style lang="scss">
@import 'NewRequest';
</style>
