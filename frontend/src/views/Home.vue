<template>
  <div class="home">
    <h1>Home</h1>
    <h3>Current Contract Fee: {{ contractFee }} WEI</h3>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi ad quod
      numquam corrupti vero similique facilis iure repellendus nihil cumque nemo
      a nulla, quisquam soluta debitis aspernatur temporibus aperiam
      perspiciatis?
    </p>
    <button @click="init">Test</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    contractFee: state => state.contractFee
  }),
  components: {},
  methods: {
    async init() {
      console.log(this.$store.state.contractFee)
    }
  }
}
</script>
