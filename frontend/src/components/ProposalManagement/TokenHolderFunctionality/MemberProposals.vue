<template>
  <div class="memberProposals">
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
              >Disgree</div
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
        const proposalType = parseFloat(element.propType)
        const proposal = {
          address: element.proposalAddress,
          description: null,
        }
        if (proposalType === 2) {
          proposal.description = 'Add Member: ' + element.memberAddress
          this.filteredProposals.push(proposal)
        }
        if (proposalType === 3) {
          proposal.description = 'Remove Member: ' + element.memberAddress
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
