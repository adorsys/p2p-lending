<template>
  <div class="about">
    <div class="x-large">About</div>
    <div class="about__content">
      <div>
        <p class="lead">
          p2p-Lending is a decentralized platform that uses the results of
          several bachelor and master theses by students working at
        </p>
        <p class="lead company">adorsys GmbH & Co. KG</p>
        <p class="lead">
          in order to illustrate the possibilities of blockchain technologies
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.about {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .lead {
    padding: 0;

    &:first-of-type {
      padding-top: 1rem;
    }

    &:last-of-type {
      padding-bottom: 1rem;
    }
  }
}
</style>
