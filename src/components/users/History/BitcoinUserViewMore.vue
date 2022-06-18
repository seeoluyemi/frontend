<template>
  <v-dialog v-model="dialog" max-width="500" @click:outside="close" @keydown.esc="close">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h4>Bitcoin Transaction</h4>
        <VBtn icon @click="close">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </v-card-title>
      <v-card-text>
        <div class="img-btc d-flex">
          <v-img :width="item.proof_url ? '50%' : '450'" max-height="200" class="rounded-lg ah-cursor-pointer mr-3" @click="imageInView = item.image; imageViewDialog = true" :src="item.image" transition="scale-transition"/>
          <v-img width="50%" max-height="200" class="rounded-lg ah-cursor-pointer" @click="imageInView = item.proof_url; imageViewDialog = true" :src="item.proof_url" transition="scale-transition"/>
        </div>
        <div class="my-4">
          <v-divider/>
          <div class="my-4 d-flex justify-space-between">
            <span>Time: <span class="time font-weight-bold">{{ formatTime(item.time) }}</span></span>
            <span>Date: <span class="time font-weight-bold">{{ formatDate(item.date) }}</span></span>
          </div>
          <v-divider/>
          <div class="my-4 d-flex justify-space-between">
            <span>Status: <span class="status font-weight-bold"><transaction-status
                :status="item.status"/></span></span>
            <span>Rate: <span class="rate font-weight-bold">&#8358;{{$numberToAmount(item.rate).format('0,0')}}</span></span>
          </div>
          <v-divider/>
          <div class="my-4 d-flex justify-space-between">
            <span>Amount: <span class="amount font-weight-bold">&#8358;{{ $numberToAmount(item.amount).format('0,0') }}</span></span>
            <span>BTC: <span class="amount font-weight-bold">{{ item.value }}</span></span>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <bitcoin-image-view :image="imageInView" :dialog="imageViewDialog" @close="imageViewDialog = false" />
  </v-dialog>
</template>

<script>
import TransactionStatus from "@/components/users/TransactionStatus";
import dateformat from "dateformat";
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";

export default {
  name: "BitcoinUserViewMore",
  components: {BitcoinImageView, TransactionStatus},
  data: () => ({
    imageInView: '',
    imageViewDialog: false
  }),
  methods: {
    formatDate(date) {
      return dateformat(date, 'dd/mm/yy')
    },
    formatTime(date) {
      return dateformat(date, 'HH:MM')
    },
    close() {
      this.$emit('close')
    }
  },
  props: {
    item: Object,
    dialog: Boolean
  }
}
</script>

<style scoped lang="scss">
.v-dialog {
  overflow-x: hidden !important;
}
</style>