<template>
  <div class="newRequest">
    <div class="card card--newRequest">
      <div
        class="newRequest__close"
        @click="$emit('closeRequestCreation')"
      ></div>
      <div class="title">Create Lending Request</div>
      <div class="newRequest__numberInputs">
        <div class="input-group newRequest__credit">
          <input
            type="text"
            onkeydown="return (/^[0-9.]$/.test(event.key) ||
          event.key === 'Backspace')"
            id="newRequest__credit"
            class="form-control"
            v-model="credit"
            v-bind:class="{
              hasContent: credit.length > 0,
              invalidInput: invalidCredit,
            }"
          />
          <label for="newRequest__credit">Ask for (ETH)</label>
        </div>
        <div class="input-group newRequest__payback">
          <input
            type="text"
            onkeydown="return (/^[0-9.]$/.test(event.key) ||
          event.key === 'Backspace')"
            id="newRequest__payback"
            class="form-control"
            v-model="payback"
            v-bind:class="{
              hasContent: payback.length > 0,
              invalidInput: invalidPayback,
            }"
          />
          <label for="newRequest__payback">Payback (ETH)</label>
        </div>
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
        <label for="newRequest__description">Request Description</label>
      </div>
      <div class="newRequest__button btn btn--form" @click="submit">Submit</div>
    </div>
  </div>
</template>

<script>
import { RequestManagementService } from '../../../services/requestManagement/RequestManagementService'

export default {
  data() {
    return {
      credit: '',
      payback: '',
      description: '',
      invalidCredit: false,
      invalidPayback: false,
      invalidDescription: false,
    }
  },
  methods: {
    async submit() {
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
        this.credit = ''
        this.payback = ''
        this.description = ''
        this.invalidCredit = false
        this.invalidPayback = false
        this.invalidDescription = false

        // close create request overlay
        this.$emit('closeRequestCreation')
      }
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
