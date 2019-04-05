<template>
  <div class="landingpage">
    <div class="landingpage__container">
      <div
        class="landingpage__item landingpage__item--ask"
        @click="$router.push('userrequests')"
      >
        <div class="content__container">
          <div class="subtitle subtitle--landingpageItem">Asker</div>
          <div class="subtitle subtitle--description">Create a Request</div>
        </div>
      </div>
      <div
        class="landingpage__item landingpage__item--lend"
        @click="$router.push('lendingrequests')"
      >
        <div class="content__container">
          <div class="subtitle subtitle--landingpageItem">Lender</div>
          <div class="subtitle subtitle--description">See open requests</div>
        </div>
      </div>
      <div
        class="landingpage__item landingpage__item--ico"
        v-if="icoActive || bMember"
        @click="$router.push('ico')"
      >
        <div class="content__container">
          <div class="subtitle subtitle--landingpageItem">ICO</div>
          <div class="subtitle subtitle--description" v-if="icoActive">
            Participate in ICO
          </div>
          <div class="subtitle subtitle--description" v-if="!icoActive">
            Manage Token
          </div>
        </div>
      </div>
      <div
        class="landingpage__item landingpage__item--manage"
        v-if="bMember || tHolder"
        @click="$router.push('p2pManagement')"
      >
        <div class="content__container">
          <div class="subtitle subtitle--landingpageItem">Stakeholder</div>
          <div class="subtitle subtitle--description">Management</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    icoActive: state => state.icoState.isIcoActive,
    bMember: state => state.boardMember,
    tHolder: state => state.tokenHolder
  })
}
</script>

<style lang="scss">
@import './landingpage';
</style>
