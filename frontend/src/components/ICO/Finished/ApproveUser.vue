<template>
  <div class="approveUser">
    <span class="approveUser__description"
      >Approve another account to use a certain amount of your TrustToken</span
    >
    <div class="input-group approveUser__amountInput">
      <input
        type="text"
        onkeydown="return (/^[0-9.]$/.test(event.key) ||
          event.key === 'Backspace')"
        id="approveUser__amount"
        class="form-control"
        v-model="amount"
        v-bind:class="{
          hasContent: amount.length > 0,
          invalidInput: invalidAmount,
        }"
      />
      <label for="approveUser__amount">TrustToken (TT)</label>
    </div>
    <div class="input-group approveUser__targetInput">
      <input
        type="text"
        id="approveUser__target"
        class="form-control"
        v-model="target"
        v-bind:class="{
          hasContent: target.length > 0,
          invalidInput: invalidTarget,
        }"
      />
      <label for="approveUser__target">Account to approve (Address)</label>
    </div>
    <div class="approveUser__button btn btn--form" @click="approve"
      >Approve</div
    >
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'
export default {
  data() {
    return {
      amount: '',
      target: '',
      invalidAmount: false,
      invalidTarget: false,
    }
  },
  methods: {
    async approve() {
      const giveApprovalReturn = await ICOService.giveApproval(
        this.amount,
        this.target
      )

      // update error states
      this.invalidAmount = giveApprovalReturn.invalidAmount
      this.invalidTarget = giveApprovalReturn.invalidTarget

      // reset input on success
      if (!(this.invalidAmount || this.invalidTarget)) {
        this.target = ''
        this.amount = ''
      }
    },
  },
  watch: {
    amount() {
      this.invalidAmount = false
    },
    target() {
      this.invalidTarget = false
    },
  },
}
</script>

<style lang="scss">
@import 'ApproveUser';
</style>
