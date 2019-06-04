<template>
  <div class="giveApproval">
    <div class="input-group giveApproval__target">
      <input
        type="text"
        id="giveApproval__target"
        class="form-control"
        v-model="target"
        v-bind:class="{
          hasContent: target.length > 0,
          invalidInput: invalidTarget,
        }"
      />
      <label for="giveApproval__target">Target Address</label>
    </div>
    <div class="input-group giveApproval__amount">
      <input
        type="number"
        min="1"
        onkeydown="return event.keyCode !== 69"
        id="giveApproval__amount"
        class="form-control"
        v-model="amount"
        v-bind:class="{ hasContent: amount, invalidInput: invalidAmount }"
      />
      <label for="giveApproval__amount">Allowance</label>
    </div>
    <div class="giveApproval__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="approve">Approve</div>
    </div>
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'
export default {
  data() {
    return {
      target: '',
      amount: null,
      invalidTarget: false,
      invalidAmount: false,
    }
  },
  methods: {
    async approve() {
      const giveApprovalReturn = await ICOService.giveApproval(
        this.amount,
        this.target
      )
      // update error states
      this.invalidTarget = giveApprovalReturn.invalidTarget
      this.invalidAmount = giveApprovalReturn.invalidAmount
      // reset input on success
      if (!(this.invalidTarget || this.invalidAmount)) {
        this.reset()
      }
    },
    reset() {
      this.target = ''
      this.amount = null
    },
  },
  watch: {
    target() {
      this.invalidTarget = false
    },
    amount() {
      this.invalidAmount = false
    },
  },
}
</script>

<style lang="scss">
.giveApproval {
  display: grid;
  grid-template-rows: repeat(3, minmax(80px, 10vh));

  &__target {
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
