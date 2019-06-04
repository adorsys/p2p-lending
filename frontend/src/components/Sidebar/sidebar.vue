<template>
  <div class="sidebar">
    <ul class="sidebar__container">
      <li class="sidebar__items">
        <ul class="sidebar__request-container">
          <li class="sidebar__request sidebar__title">Lending Requests</li>
          <li class="sidebar__request">
            <ul class="sidebar__request-items">
              <li class="sidebar__request-item">
                <router-link
                  :to="{ name: 'createRequest' }"
                  class="sidebar__link"
                  >Create New Request</router-link
                >
              </li>
              <li class="sidebar__request-item">
                <router-link
                  :to="{ name: 'lendingRequests' }"
                  class="sidebar__link"
                  >View All Requests</router-link
                >
              </li>
              <li class="sidebar__request-item">
                <router-link
                  :to="{ name: 'userRequests' }"
                  class="sidebar__link"
                  >View Your Requests</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li class="sidebar__items">
        <ul class="sidebar__container">
          <li class="sidebar__request sidebar__title">Management</li>
          <li class="sidebar__request">
            <ul class="sidebar__request-items">
              <li class="sidebar__request-item">
                <router-link :to="{ name: 'ico' }" class="sidebar__link"
                  >Token Management</router-link
                >
              </li>
              <li
                class="sidebar__request-item"
                v-if="boardMember || tokenHolder"
              >
                <router-link
                  :to="{ name: 'p2pManagement' }"
                  class="sidebar__link"
                  >Board Management</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('auth', ['boardMember', 'tokenHolder']),
  },
}
</script>

<style lang="scss">
@import 'Sidebar';
</style>
