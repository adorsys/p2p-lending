<template>
  <div class="checkAllowance">
    <span
      class="checkAllowance__description"
      v-bind:class="{
        allowanceContent: amount.length > 0 && address.length > 0,
      }"
    >
      You are allowed to spend
      <strong>{{ amount }} TrustToken</strong>
      for the account:
      <strong>{{ address }}</strong>
    </span>
    <div class="input-group checkAllowance__targetInput">
      <input
        type="text"
        id="checkAllowance__target"
        class="form-control"
        v-model="target"
        v-bind:class="{
          hasContent: target.length > 0,
          invalidInput: invalidTarget,
        }"
      />
      <label for="checkAllowance__target">Check Allowance for (Address)</label>
    </div>
    <div class="checkAllowance__button btn btn--form" @click="check">Check</div>
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'

export default {
  data() {
    return {
      amount: '',
      address: '',
      target: '',
      invalidTarget: false,
    }
  },
  methods: {
    async check() {
      const checkAllowanceReturn = await ICOService.checkAllowance(this.target)

      // update error state
      this.invalidTarget = checkAllowanceReturn.invalidOwner

      if (!this.invalidTarget) {
        this.amount = checkAllowanceReturn.allowance
        this.address = this.target
        this.target = ''
        this.invalidTarget = false
      }
    },
  },
  watch: {
    target() {
      this.invalidTarget = false
    },
  },
}
</script>

<style lang="scss">
@import 'CheckAllowance';
</style>
