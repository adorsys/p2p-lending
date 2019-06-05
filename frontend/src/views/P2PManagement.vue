<template>
  <div class="boardManagement">
    <div class="x-large">Board Management</div>
    <section class="boardManagement__content">
      <ProposalControl />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProposalControl from '../components/ProposalManagement/ProposalControl'

export default {
  components: {
    ProposalControl,
  },
  computed: {
    ...mapState('auth', ['boardMember', 'tokenHolder']),
    ...mapState('ico', ['contractBalance']),
    ...mapState('proposalManagement', ['contractFee']),
  },
}
</script>
