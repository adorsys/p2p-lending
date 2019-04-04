<template>
  <div class="landingpage">
    <div class="landingpage__container">
      <div class="landingpage__item landingpage__item--ask">
        <div class="subtitle subtitle--landingpageItem">Asker</div>
        <div class="content__container">
          <div class="subtitle subtitle--description">
            Click here if you want to create a new request
          </div>
          <div class="button button--landingpage">
            <router-link
              :to="{ name: 'userrequests' }"
              class="landingpage--route"
              >Lending Request Creation</router-link
            >
          </div>
        </div>
      </div>
      <div class="landingpage__item landingpage__item--lend">
        <div class="subtitle subtitle--landingpageItem">Lender</div>
        <div class="content__container">
          <div class="subtitle subtitle--description">
            Click here if you want to see open requests
          </div>
          <div class="button button--landingpage">
            <router-link
              :to="{ name: 'lendingrequests' }"
              class="landingpage--route"
              >Available Lending Requests</router-link
            >
          </div>
        </div>
      </div>
      <div class="landingpage__item landingpage__item--manage">
        <div class="subtitle subtitle--landingpageItem">Stakeholder</div>
        <div class="content__container">
          <div class="subtitle subtitle--description">
            You want to participate in the management of the platform
          </div>
          <div class="button button--landingpage">
            <router-link :to="{ name: 'ico' }" class="landingpage--route"
              >ICO Management</router-link
            >
          </div>
          <div class="button button--landingpage" v-if="tHolder || bMember">
            <router-link
              :to="{ name: 'p2pManagement' }"
              class="landingpage--route"
              >Lending Management</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    bMember: state => state.boardMember,
    tHolder: state => state.tokenHolder
  })
}
</script>

<style lang="scss">
@import './landingpage';
</style>
