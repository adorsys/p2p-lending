<template>
  <div class="ico">
    <div class="ico__header" v-if="getManagement()">
      <div class="title ico__title">{{ title }}</div>
      <div class="ico__status" v-if="active">Active</div>
    </div>
    <ICOInfo class="ico__info" v-if="getManagement()" />
    <ICOProgress class="ico__progress" v-if="getManagement() && active" />
    <ICOInvest class="ico__invest" v-if="getManagement() && active" />
    <ICOControl class="ico__control" v-if="getManagement() && !active" />
    <router-view class="ico__management" v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ICOInfo from '../components/ICO/ICOInfo'
import ICOProgress from '../components/ICO/Active/ICOProgress'
import ICOInvest from '../components/ICO/Active/ICOInvest'
import ICOControl from '../components/ICO/Finished/ICOControl'

export default {
  computed: {
    ...mapState('ico', ['active']),
  },
  components: {
    ICOInfo,
    ICOProgress,
    ICOInvest,
    ICOControl,
  },
  data() {
    return {
      title: null,
    }
  },
  methods: {
    getManagement() {
      if (this.$route.matched.some((record) => record.name === 'memberArea')) {
        return false
      }
      return true
    },
  },
  mounted() {
    this.active
      ? (this.title = 'Initial Coin Offering')
      : (this.title = 'Management')

    // authenticate user on load
    this.$store.dispatch('auth/logIn')
  },
  watch: {
    active(status) {
      status
        ? (this.title = 'Initial Coin Offering')
        : (this.title = 'Management')
    },
  },
}
</script>

<style lang="scss">
@import '../util/scss/variables';

.ico {
  margin-top: 52px;
  display: grid;
  grid-template-columns: 1fr 476px 476px 1fr;
  grid-template-rows: 1fr 150px 350px auto;
  column-gap: 20px;
  row-gap: 20px;
  align-items: center;
  justify-items: center;

  &__header {
    grid-row: 1;
    grid-column: 2 / 4;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__title {
    font-size: 38px;
  }

  &__status {
    height: 24px;
    width: 84px;
    border-radius: 100px;
    background-color: $bg-active;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.2px;
    color: $bg-white;
  }

  &__info {
    grid-row: 2;
    grid-column: 2 / 4;
  }

  &__progress {
    grid-row: 3;
    grid-column: 2;
  }

  &__invest {
    grid-row: 3;
    grid-column: 3;
  }

  &__control {
    grid-row: 3 / 5;
    grid-column: 2 / 4;
  }

  &__management {
    grid-row: 2 / 5;
    grid-column: 2 / 4;
    align-self: start;
    justify-self: start;
  }
}
</style>
