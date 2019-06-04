<template>
  <div class="newRequest">
    <div class="input-group newRequest__asked">
      <input
        type="number"
        min="0"
        onkeydown="return event.keyCode !== 69"
        id="newRequest__asked"
        class="form-control"
        v-model="credit"
        v-bind:class="{
          hasContent: credit,
          invalidInput: invalidCredit,
        }"
      />
      <label for="newRequest__asked">Credit</label>
    </div>
    <div class="input-group newRequest__payback">
      <input
        type="number"
        min="0"
        onkeydown="return event.keyCode !== 69"
        id="newRequest__payback"
        class="form-control"
        v-model="payback"
        v-bind:class="{
          hasContent: payback,
          invalidInput: invalidPayback,
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
          invalidInput: invalidDescription,
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
import { RequestManagementService } from '../../../services/requestManagement/RequestManagementService'
export default {
  data() {
    return {
      credit: null,
      payback: null,
      description: '',
      invalidCredit: false,
      invalidPayback: false,
      invalidDescription: false,
    }
  },
  methods: {
    async submit() {
      this.error = false
      const createRequestReturn = await RequestManagementService.createRequest(
        this.credit,
        this.payback,
        this.description
      )
      // update error states
      this.invalidCredit = createRequestReturn.invalidCredit
      this.invalidPayback = createRequestReturn.invalidPayback
      this.invalidDescription = createRequestReturn.invalidDescription
      // reset input on success
      if (
        !(this.invalidCredit || this.invalidPayback || this.invalidDescription)
      ) {
        this.reset()
      }
    },
    reset() {
      this.credit = null
      this.payback = null
      this.description = ''
      this.invalidCredit = false
      this.invalidPayback = false
      this.invalidDescription = false
    },
  },
  watch: {
    credit() {
      this.invalidCredit = false
    },
    payback() {
      this.invalidPayback = false
    },
    description() {
      this.invalidDescription = false
    },
  },
}
</script>

<style lang="scss">
@import 'NewRequest';
</style>
