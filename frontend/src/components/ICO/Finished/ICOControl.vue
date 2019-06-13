<template>
  <div class="icoControl card card--icoFinished">
    <div class="icoControl__selections">
      <div
        class="icoControl__selection"
        v-bind:class="{ activeSelect: active === 0 }"
      >
        <span @click="select(0)">Send TrustToken</span>
        <div
          class="icoControl__bottomBorder"
          v-bind:class="{ activeSelect: active === 0 }"
        ></div>
      </div>
      <div
        class="icoControl__selection"
        v-bind:class="{ activeSelect: active === 1 }"
      >
        <span @click="select(1)">Approve User</span>
        <div
          class="icoControl__bottomBorder"
          v-bind:class="{ activeSelect: active === 1 }"
        ></div>
      </div>
      <div
        class="icoControl__selection"
        v-bind:class="{ activeSelect: active === 2 }"
      >
        <span @click="select(2)">Check Allowance</span>
        <div
          class="icoControl__bottomBorder"
          v-bind:class="{ activeSelect: active === 2 }"
        ></div>
      </div>
    </div>
    <div class="icoControl__area">
      <SendToken v-if="active === 0" />
      <ApproveUser v-if="active === 1" />
      <CheckAllowance v-if="active === 2" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SendToken from './SendToken'
import ApproveUser from './ApproveUser'
import CheckAllowance from './CheckAllowance'

export default {
  computed: {
    ...mapState('auth', ['tokenHolder', 'boardMember']),
  },
  components: {
    SendToken,
    ApproveUser,
    CheckAllowance,
  },
  data() {
    return {
      active: 0,
    }
  },
  methods: {
    select(idx) {
      if (this.active !== idx) {
        this.active = idx
      }
    },
  },
}
</script>

<style lang="scss">
@import 'ICOControl';
</style>
