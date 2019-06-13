<template>
  <div
    class="table__wrapper table__wrapper--hide"
    v-bind:class="{ 'table__wrapper--show': memberProposals.length > 0 }"
  >
    <table class="table">
      <tbody>
        <tr
          class="table__row"
          v-for="(item, index) in memberProposals"
          :key="index"
        >
          <td class="table__data table__data--id">{{ index + 1 }}</td>
          <td class="table__data table__data--description">
            {{ item.description }}
          </td>
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
import { ProposalManagementService } from '../../services/proposalManagement/ProposalManagementService'

export default {
  computed: {
    ...mapState('proposalManagement', ['proposals']),
  },
  data() {
    return {
      memberProposals: [],
    }
  },
  methods: {
    filterProposals() {
      this.memberProposals = []

      this.proposals.forEach(async (element) => {
        const proposalType = parseFloat(element.propType)
        const proposal = {
          address: element.proposalAddress,
          description: null,
        }

        if (proposalType === 2) {
          proposal.description = 'Add Member: ' + element.memberAddress
          this.memberProposals.push(proposal)
        }

        if (proposalType === 3) {
          proposal.description = 'Remove Member: ' + element.memberAddress
          this.memberProposals.push(proposal)
        }
      })
    },
    async vote(stance, address) {
      ProposalManagementService.vote(stance, address)
    },
  },
  watch: {
    proposals() {
      this.filterProposals()
    },
  },
  mounted() {
    this.filterProposals()
  },
}
</script>
