<template>
  <div class="checkAllowance">
    <div class="input-group checkAllowance__target">
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
      <label for="checkAllowance__target">Target Address</label>
    </div>
    <div class="checkAllowance__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="checkAllowance">Check</div>
    </div>
    <div class="checkAllowance__allowance" v-if="allowance !== null">
      <div class="lead">Current Allowance: {{ allowance }} {{ symbol }}</div>
    </div>
  </div>
</template>

<script>
import { ICOService } from '../../../services/icoContract/IcoService'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('ico', ['symbol']),
  },
  data() {
    return {
      target: '',
      invalidTarget: false,
      allowance: null,
    }
  },
  methods: {
    async checkAllowance() {
      const checkAllowanceReturn = await ICOService.checkAllowance(this.target)
      // update error states
      this.allowance =
        checkAllowanceReturn.allowance > 0 ? checkAllowanceReturn.allowance : 0
      this.invalidTarget = checkAllowanceReturn.invalidOwner
      // reset input on success
      if (!this.invalidTarget) {
        this.target = ''
      }
    },
    reset() {
      this.target = ''
      this.allowance = null
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
.checkAllowance {
  display: grid;
  grid-template-rows: repeat(3, minmax(80px, 10vh));

  &__target {
    grid-row: 1;
  }

  &__buttons {
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
  }

  &__allowance {
    grid-row: 3;
  }
}
</style>
