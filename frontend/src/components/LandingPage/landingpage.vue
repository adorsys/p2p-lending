<template>
  <div class="landingPage">
    <section class="landingPage__logo">
      <img src="../../assets/ethereum.svg" class="logo__image" />
      <div class="title title--landingPage">{{ title }}</div>
    </section>
    <section class="landingPage__roles">
      <div class="roles__item" @click="$router.push({ name: 'requests' })">
        <div class="item__title">Manage Requests</div>
      </div>
      <div
        class="roles__item"
        @click="$router.push({ name: 'ico' })"
        v-if="icoActive"
      >
        <div class="item__title">Investor</div>
      </div>
    </section>
    <section class="landingPage__textArea">
      <p class="textArea--description">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        expedita excepturi non, saepe voluptatem laborum molestiae maxime
        aliquid, iure laboriosam quam veniam, aliquam cupiditate nulla. Ipsum
        laborum nostrum dicta velit fugit, similique unde obcaecati possimus ad
        quibusdam sapiente quisquam temporibus doloribus asperiores, cum
        corporis incidunt exercitationem! Nesciunt, aspernatur? Repellendus
        nihil, neque aliquam delectus quibusdam maxime alias excepturi nostrum
        in laboriosam ullam doloremque deleniti error itaque libero aperiam
        laborum fugit esse tenetur culpa, sed quaerat fugiat. Soluta amet
        voluptates tempora natus odio incidunt tempore dolore? Dignissimos
        dolorem harum aliquam veniam a quis possimus! Ut ad pariatur maiores
        accusamus quaerat eaque accusantium?
      </p>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LandingPage',
  props: {
    title: String
  },
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
