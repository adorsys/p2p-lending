<template>
  <div class="feeProposals">
    <div class="table__wrapper">
      <table class="table" v-if="filteredProposals.length > 0">
        <thead>
          <tr>
            <th class="table__head">Description</th>
            <th class="table__head">Vote</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in filteredProposals" :key="p.idx">
            <td class="table__data">{{ p.description }}</td>
            <td class="table__data">
              <div class="btn btn--table" @click="vote(true, p.address)"
                >Yes</div
              >
              <div class="btn btn--table" @click="vote(false, p.address)"
                >No</div
              >
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table" v-else>
        <thead>
          <tr>
            <th class="table__head table__head--empty"
              >ContractFee Proposals</th
            >
          </tr>
        </thead>
        <tbody>
          <tr class="table__row">
            <td class="table__data">No Proposals Found</td>
          </tr>
        </tbody>
      </table>
    </div>
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
