<template>
  <div class="lendingRequestManagement">
    <div class="createLendingRequest">
      <div class="subtitle subtitle--lendingRequest">Create Lending Request</div>
      <div
        class="button button--lendingRequest"
        @click="$emit('openRequestOverlay')"
      >Create Lending Request</div>
      <slot/>
    </div>
    <hr class="separator">
    <div class="request__management">
      <div class="subtitle">Open Lending Requests</div>
      <table class="table" v-if="proposals.length !== 0">
        <thead>
          <tr>
            <th class="table__head">Asker</th>
            <th class="table__head">Amount Asked</th>
            <th class="table__head">Payback Amount</th>
            <th class="table__head">Trusted</th>
            <th class="table__head">Vote</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in proposals" :key="p.idx">
            <td class="table__data">{{ p.author }}</td>
            <td class="table__data">{{ p.askAmount }}</td>
            <td class="table__data">{{ p.paybackAmount }}</td>
            <td class="table__data">{{ p.trusted }}</td>
            <td class="table__data table__data--vote">
              <div v-on:click="claim(p.address)" class="button button--table button--claim">Lend</div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table" v-if="proposals.length === 0">
        <thead>
          <tr class="table__row">
            <th>Proposals</th>
          </tr>
        </thead>
        <tbody>
          <td class="table__data">No Proposals found</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      proposals: [
        {
          author: 'owner',
          askAmount: 1 + ' ETH',
          paybackAmount: 2 + ' ETH',
          address: 0,
          trusted: true
        }
      ]
    }
  },
  methods: {
    claim(address) {
      console.log('lending : ' + address)
    }
  }
}
</script>

<style lang="scss">
@import './lendingRequests';
</style>
