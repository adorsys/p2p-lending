<template>
  <div class="ico">
    <h1>ICO Management</h1>
    <input
      type="text"
      name="ico__input-1"
      id="ico__input-1"
      class="ico__input"
      v-model="input_1"
      placeholder="input-1"
    >
    <div class="button button--ico" @click="submit">Submit</div>
    {{ input_1 }}
    {{ output_1 }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      input_1: null,
      output_1: 0
    }
  },
  methods: {
    async submit() {
      console.log('test')
      console.log(this.input_1)
      console.log(
        await this.$store.state
          .contractInstance()
          .methods.minQuorum()
          .call()
      )
      this.output_1 = await this.$store.state
        .contractInstance()
        .methods.minQuorum()
        .call()
    }
  }
}
</script>

<style lang="scss" scoped>
$navbar-background-color: #dadada;
$navbar-hover-color: #f3f3f3;
$navbar-height: 44px;

$background-color: #dadada;
$background-color-inactive: #e7e7e7;

$padding-standard: 7px;

$border-color: #a0a0a0;
$border-width: 2px;

$link-text-color: #666;
$link-text-color-darkened: #444;

.ico__input {
  padding: 0.7em;
  background-color: $navbar-hover-color;
  border: 2px solid rgba($color: $border-color, $alpha: 0.3);
}

.button {
  all: unset;
  display: inline-block;
  margin-top: 25px;
  margin-right: 0.5em;
  margin-bottom: 25px;
  margin-left: 0.5em;
  padding: 0.5em 1.25em;
  width: 70px;
  cursor: pointer;
  background: $navbar-background-color;
  color: $link-text-color-darkened;
  border: 1px solid rgba($color: $border-color, $alpha: 0.3);
  border-radius: 2px;
  box-shadow: 0 0px 12px -6px rgba($color: #000000, $alpha: 0.3);
  font-weight: 600;
}
</style>
