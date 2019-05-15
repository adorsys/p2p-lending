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
      <div v-if="active === 1">test1</div>
      <div v-if="active === 2">test2</div>
      <div v-if="active === 3">test3</div>
    </div>
  </div>
</template>

<script>
import Transfer from './Transfer'

export default {
  components: {
    Transfer,
  },
  data() {
    return {
      active: null,
    }
  },
  methods: {
    setActive(id) {
      if (this.active === id) {
        this.active = null
      } else {
        this.active = id
      }
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
    padding-top: 2rem;
    display: grid;
    grid-template-columns: 20% auto 20%;

    .transfer {
      grid-column: 2;
    }
  }
}
</style>
