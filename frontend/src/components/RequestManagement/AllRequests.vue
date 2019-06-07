<template>
  <div class="allRequests">
    <div class="allRequests__title-wrapper">
      <div class="allRequests__title">Requests</div>
      <div class="allRequests__sortOptions">
        <div class="allRequests__sortOption">All</div>
        <div class="allRequests__sortOption">Trusted</div>
      </div>
    </div>
    <div class="table__wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="table__head table__head--id"></th>
            <th class="table__head table__head--asker">Asker</th>
            <th class="table__head">Amount</th>
            <th class="table__head">Payback</th>
            <th class="table__head table__head--purpose">Purpose</th>
            <th class="table__head table__head--purpose">Trusted</th>
            <th class="table__head">Option</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="table__row"
            v-for="(item, index) in filteredRequests"
            :key="index"
          >
            <td class="table__data table__data--id">{{ index + 1 }}</td>
            <td class="table__data table__data--purpose">{{ item.asker }}</td>
            <td class="table__data">{{ item.askAmount }} ETH</td>
            <td class="table__data">{{ item.paybackAmount }} ETH</td>
            <td class="table__data">{{ item.purpose }}</td>
            <td class="table__data">{{ item.trusted }}</td>
            <td class="table__data">
              <div class="btn btn--table">Lend</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filteredRequests: [
        {
          asker: '0x3a4A8fE63AAb71E36732379af5586f4936A2BfFC',
          askAmount: '1',
          paybackAmount: '1.5',
          purpose: 'Kopfhörer',
          trusted: false,
        },
      ],
    }
  },
}
</script>

<style lang="scss">
@import 'AllRequests';
</style>
