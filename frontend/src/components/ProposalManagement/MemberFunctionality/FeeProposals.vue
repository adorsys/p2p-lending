<template>
  <div class="feeProposals">
    <table class="table">
      <thead>
        <tr class="table__row">
          <th class="table__head">Description</th>
          <th class="table__head">Vote</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table__row" v-for="p in filteredProposals" :key="p.idx">
          <td class="table__data bulletpoint">{{ p.description }}</td>
          <td class="table__data">
            <div class="btn btn--light" @click="vote(true, p.address)"
              >Agree</div
            >
            <div class="btn btn--light" @click="vote(false, p.address)"
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
import { Web3Service } from '../../../services/web3/Web3Service'
import { ProposalManagementService } from '../../../services/proposalManagement/ProposalManagementService'
export default {
  computed: {
    ...mapState('proposalManagement', ['proposals']),
  },
  data() {
    return {
      filteredProposals: [],
    }
  },
  methods: {
    filterProposals() {
      this.filteredProposals = []
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
          this.filteredProposals.push(proposal)
        }
      })
    },
    async vote(stance, address) {
      await ProposalManagementService.vote(stance, address)
    },
  },
  watch: {
    proposals() {
      this.filterProposals()
    },
  },
  created() {
    this.filterProposals()
  },
}
</script>
