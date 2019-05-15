<template>
  <div class="invest">
    <div class="input-group invest__input">
      <input
        type="text"
        id="invest__amount"
        class="form-control"
        v-model="amount"
        v-bind:class="{ hasContent: amount.length > 0, invalidInput: error }"
      />
      <label for="invest__amount">Investment (ETH)</label>
    </div>
    <div class="btn btn--light invest__button" @click="invest">Invest</div>
  </div>
</template>

<script>
import { icoInstance } from '@/services/icoContract/getIco'
import { web3Instance } from '@/services/web3/getWeb3'

export default {
  data() {
    return {
      amount: '',
      error: false,
    }
  },
  methods: {
    async invest() {
      this.error = false
      if (this.amount.length > 0) {
        const web3 = await web3Instance.getInstance()
        const contract = await icoInstance.getInstance()
        const user = await web3.eth.getCoinbase()
        try {
          const buyAmount = web3.utils.toWei(this.amount, 'ether')
          await contract.methods
            .participate()
            .send({ value: buyAmount, from: user })
          this.amount = ''
        } catch (err) {
          this.error = true
        }
      } else {
        this.error = true
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
