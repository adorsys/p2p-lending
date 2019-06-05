<template>
  <div class="progressBar">
    <span class="progressBar__bg">
      <span class="progressBar__status" id="progressBar__status"></span>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('ico', ['contractBalance', 'goal']),
  },
  methods: {
    updateProgress() {
      const progressBar = document.getElementById('progressBar__status')
      const newWidth = (this.contractBalance / this.goal) * 100
      if (newWidth >= 100) {
        progressBar.style.borderTopRightRadius = '10px'
        progressBar.style.borderBottomRightRadius = '10px'
      }
      progressBar.style.width = `${newWidth}%`
    },
  },
  watch: {
    contractBalance() {
      this.updateProgress()
    },
  },
  mounted() {
    this.updateProgress()
  },
}
</script>
