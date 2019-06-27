<template>
  <div class="sendToken">
    <div class="sendToken__transferToggle">
      <input
        type="checkbox"
        class="sendToken__toggle"
        id="sendToken__toggle"
        v-model="fromActive"
      />
      <label for="sendToken__toggle"
        >Send TrustToken from another account</label
      >
    </div>
    <div class="sendToken__amountInputWrapper">
      <div class="input-group sendToken__dummy">
        <input type="text" id="sendToken__dummy" class="form-control" />
        <label for="sendToken__dummy">Dummy</label>
      </div>
      <div class="input-group sendToken__amountInput">
        <input
          type="text"
          onkeydown="return (/^[0-9.]$/.test(event.key) ||
          event.key === 'Backspace')"
          id="sendToken__amount"
          class="form-control"
          v-model="amount"
          v-bind:class="{
            hasContent: amount.length > 0,
            invalidInput: invalidAmount,
          }"
        />
        <label for="sendToken__amount">TrustToken (TT)</label>
      </div>
    </div>
    <div class="sendToken__addressInputs">
      <div
        class="input-group sendToken__originInput"
        v-bind:class="{ displayFrom: fromActive }"
      >
        <input
          type="text"
          id="sendToken__origin"
          class="form-control"
          v-model="origin"
          v-bind:class="{
            hasContent: origin.length > 0,
            invalidInput: invalidOrigin,
          }"
        />
        <label for="sendToken__origin">From Account (Address)</label>
      </div>
      <div class="input-group sendToken__targetInput">
        <input
          type="text"
          id="sendToken__target"
          class="form-control"
          v-model="target"
          v-bind:class="{
            hasContent: target.length > 0,
            invalidInput: invalidTarget,
          }"
        />
        <label for="sendToken__target">To Account (Address)</label>
      </div>
    </div>
    <div class="sendToken__button btn btn--form" @click="submit">Send</div>
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'

export default {
  data() {
    return {
      fromActive: false,
      invalidAmount: false,
      invalidOrigin: false,
      invalidTarget: false,
      amount: '',
      origin: '',
      target: '',
    }
  },
  methods: {
    async submit() {
      let transferReturn

      // transfer for another account
      if (this.fromActive) {
        transferReturn = await ICOService.transferFrom(
          this.amount,
          this.origin,
          this.target
        )

        // update error states
        this.invalidAmount = transferReturn.invalidAmount
        this.invalidOrigin = transferReturn.invalidOrigin
        this.invalidTarget = transferReturn.invalidRecipient
      } else {
        // transfer from own account
        transferReturn = await ICOService.transfer(this.amount, this.target)

        // update error states
        this.invalidAmount = transferReturn.invalidAmount
        this.invalidTarget = transferReturn.invalidRecipient
      }

      // reset input on success
      if (!(this.invalidAmount || this.invalidOrigin || this.invalidTarget)) {
        this.amount = ''
        this.origin = ''
        this.target = ''
        this.invalidAmount = false
        this.invalidOrigin = false
        this.invalidTarget = false
      }
    },
  },
  watch: {
    amount() {
      this.invalidAmount = false
    },
    origin() {
      this.invalidOrigin = false
    },
    target() {
      this.invalidTarget = false
    },
  },
}
</script>

<style lang="scss">
@import 'SendToken';
</style>
