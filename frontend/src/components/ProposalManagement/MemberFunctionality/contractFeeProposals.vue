<template>
  <div>
    <div class="subtitle">Contract Fee Proposals</div>
    <div class="proposals">
      <table class="table table--feeProposals" v-if="feeProposals.length !== 0">
        <thead>
          <tr>
            <th class="table__head">Description</th>
            <th class="table__head">Cast Vote</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="p in feeProposals" :key="p.idx">
            <td class="table__data table__data--feeProposals">{{
              p.description
            }}</td>
            <td
              class="table__data table__data--feeProposals table__data--buttons"
            >
              <div
                v-on:click="vote(true, p.address)"
                class="button button--table button--vote"
                >Agree</div
              >
              <div
                v-on:click="vote(false, p.address)"
                class="button button--table button--vote"
                >Disagree</div
              >
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table table--feeProposals" v-if="feeProposals.length === 0">
        <thead>
          <tr>
            <th class="table__head">Contract Fee Proposals</th>
          </tr>
        </thead>
        <tbody>
          <td class="table__data">No Contract Fee Proposals found</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { proposalManagementInstance } from '@/services/proposalManagement/getProposalManagement'
import { Web3Service } from '@/services/web3/Web3Service'
export default {
  computed: {
    ...mapState('proposalManagement', ['proposals']),
  },
  data() {
    return {
      feeProposals: [],
    }
  },
  methods: {
    filterFeeProposals(proposals) {
      if (proposals) {
        this.feeProposals = []
        proposals.forEach((element) => {
          if (parseInt(element.propType, 10) === 1) {
            const fee = element.proposalFee / 10 ** 18
            const description = 'Change Contract Fee to ' + fee + ' ETH'

            const proposal = {
              address: element.proposalAddress,
              description: description,
            }

            this.feeProposals.push(proposal)
          }
        })
      }
    },
    async vote(stance, proposalAddress) {
      const user = await Web3Service.getUser()
      const contract = await proposalManagementInstance.getInstance()
      await contract.methods.vote(stance, proposalAddress).send({ from: user })
    },
  },
  watch: {
    proposals() {
      this.filterFeeProposals(this.proposals)
    },
  },
  created() {
    this.filterFeeProposals(this.proposals)
  },
}
</script>

<style lang="scss">
@import './contractFeeProposals';
</style>
