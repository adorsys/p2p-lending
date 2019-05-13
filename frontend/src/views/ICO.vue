<template>
  <div class="ICO">
    <div class="title">ICO Management</div>
    <hr class="separator" />
    <hr class="separator" />
    <div class="ICO__tokenSale" v-if="icoActive">
      <TokenSaleInfo />
      <hr class="separator" />
      <BuyToken :contract="icoContract" />
      <hr class="separator" />
      <ChartDoughnut />
    </div>
    <div class="ICO__management" v-if="!icoActive">
      <IcoInfo />
      <hr class="separator" />
      <IcoManagement :contract="icoContract" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BuyToken from '@/components/ICO/TokenSale/buyToken'
import TokenSaleInfo from '@/components/ICO/TokenSale/tokenSaleInfo'
import ChartDoughnut from '@/components/ICO/TokenSale/chartDoughnut'
import IcoInfo from '@/components/ICO/IcoManagement/icoInfo'
import IcoManagement from '@/components/ICO/IcoManagement/icoManagement'

export default {
  computed: mapState({
    icoContract: state => state.icoContractInstance,
    icoActive: state => state.icoState.isIcoActive
  }),
  components: {
    BuyToken,
    TokenSaleInfo,
    ChartDoughnut,
    IcoInfo,
    IcoManagement
  }
}
</script>
