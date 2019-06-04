<template>
  <div class="tokenControl">
    <div class="tokenControl__selections">
      <p
        class="btn btn--light btn--selection tokenControl__transfer"
        v-bind:class="{ isActive: active === 0 }"
        @click="setActive(0)"
        >Transfer</p
      >
      <p
        class="btn btn--light btn--selection tokenControl__transferFrom"
        v-bind:class="{ isActive: active === 1 }"
        @click="setActive(1)"
        >TransferFrom</p
      >
      <p
        class="btn btn--light btn--selection tokenControl__approve"
        v-bind:class="{ isActive: active === 2 }"
        @click="setActive(2)"
        >Give Approval</p
      >
      <p
        class="btn btn--light btn--selection tokenControl__allowance"
        v-bind:class="{ isActive: active === 3 }"
        @click="setActive(3)"
        >Check Allowance</p
      >
    </div>
    <div class="tokenControl__selectionContent">
      <Transfer v-if="active === 0" />
      <TransferFrom v-if="active === 1" />
      <GiveApproval v-if="active === 2" />
      <CheckAllowance v-if="active === 3" />
    </div>
  </div>
</template>

<script>
import Transfer from './Transfer'
import TransferFrom from './TransferFrom'
import GiveApproval from './GiveApproval'
import CheckAllowance from './CheckAllowance'
export default {
  components: {
    Transfer,
    TransferFrom,
    GiveApproval,
    CheckAllowance,
  },
  data() {
    return {
      active: null,
    }
  },
  methods: {
    setActive(id) {
      this.active = this.active === id ? null : id
    },
  },
}
</script>

<style lang="scss">
@import '../../../util/scss/variables';
.tokenControl {
  display: flex;
  flex-direction: column;

  &__selections {
    padding-top: 2rem;
    display: flex;
    justify-content: center;

    .btn--selection {
      width: 12rem;
    }

    .isActive {
      background-color: rgba($secondary-light-color, 0.4);
    }
  }

  &__selectionContent {
    padding-top: 3rem;
    display: grid;
    grid-template-columns: auto 600px auto;

    > div {
      grid-column: 2;
    }
  }
}
</style>
