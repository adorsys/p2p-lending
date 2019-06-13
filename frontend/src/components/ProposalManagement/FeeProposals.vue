<template>
  <div
    class="table__wrapper table__wrapper--hide"
    v-bind:class="{ 'table__wrapper--show': contractFeeProposals.length > 0 }"
  >
    <table class="table">
      <tbody>
        <tr
          class="table__row"
          v-for="(item, index) in contractFeeProposals"
          :key="index"
        >
          <td class="table__data table__data--id">{{ index + 1 }}</td>
          <td class="table__data table__data--description">{{
            item.description
          }}</td>
          <td class="table__data table__data--option">
            <div class="btn btn--table" @click="vote(true, item.address)"
              >Agree</div
            >
          </td>
          <td class="table__data table__data--option">
            <div class="btn btn--table" @click="vote(false, item.address)"
              >Disagree</div
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Web3Service } from '../../services/web3/Web3Service'
import { ProposalManagementService } from '../../services/proposalManagement/ProposalManagementService'

export default {
  computed: {
    ...mapState('proposalManagement', ['proposals']),
  },
  data() {
    return {
      contractFeeProposals: [],
    }
  },
  methods: {
    vote(stance, address) {
      ProposalManagementService.vote(stance, address)
    },
    filterFeeProposals() {
      this.contractFeeProposals = []

      this.proposals.forEach(async (element) => {
        if (parseFloat(element.propType) === 1) {
          const fee = await Web3Service.convertFromWei(
            element.proposalFee,
            'ether'
          )

          const description = 'Change Contract Fee to ' + fee + ' ETH'
          const proposal = {
            address: element.proposalAddress,
            description: description,
          }

          this.contractFeeProposals.push(proposal)
        }
      })
    },
  },
  mounted() {
    this.filterFeeProposals()
  },
  watch: {
    proposals() {
      this.filterFeeProposals()
    },
  },
}
</script>

<style lang="scss"></style>
