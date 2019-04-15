<template>
  <div class="generalManagment">
    <section class="managementNavigation">
      <ul class="managementNavigation__links">
        <li class="managementNavigation__link-container">
          <div
            class="managementNavigation__link"
            v-bind:class="{
              'managementNavigation__link--active': active === 0
            }"
            @click="toggleView(0)"
          >
            Fee Controls
          </div>
        </li>
        <li class="managementNavigation__link-container">
          <div
            class="managementNavigation__link"
            v-bind:class="{
              'managementNavigation__link--active': active === 1
            }"
            @click="toggleView(1)"
          >
            Member Controls
          </div>
        </li>
        <li class="managementNavigation__link-container">
          <div
            class="managementNavigation__link"
            v-bind:class="{
              'managementNavigation__link--active': active === 2
            }"
            @click="toggleView(2)"
          >
            ICO Controls
          </div>
        </li>
      </ul>
    </section>
    <section class="managementData">
      <div class="subsubtitle">Contract Fee: {{ contractFee }} ETH</div>
      <div class="subsubtitle">ICO holds: {{ icoEtherBalance }} ETH</div>
    </section>
    <section class="managementView">
      <h1>test</h1>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'generalManagement',
  computed: mapState({
    contractFee: state => state.contractFee,
    icoEtherBalance: state => state.icoState.icoEtherBalance
  }),
  props: {
    proposalContract: Function,
    ico: Function
  },
  data() {
    return {
      active: null
    }
  },
  methods: {
    toggleView(index) {
      this.active = index
    }
  }
}
</script>

<style lang="scss">
@import './generalManagement';
</style>
