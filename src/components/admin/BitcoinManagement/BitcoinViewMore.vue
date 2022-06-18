<template>
  <v-dialog v-model="dialog" max-width="500" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h4>Bitcoin More Information</h4>
        <VBtn icon @click="$emit('close')">
          <VIcon>mdi-close</VIcon>
        </VBtn>
        <v-card-text>
<!--          <div class="img" style="cursor:pointer;" @click="$emit('viewImg')">-->
<!--            <v-img :src="item.image_url" :alt="item.time"/>-->
<!--          </div>-->
          <div class="img-btc d-flex">
            <v-img :width="item.proof_url ? '50%' : '450'" max-height="200" class="rounded-lg ah-cursor-pointer mr-3" @click="imageInView = item.image_url; imageViewDialog = true" :src="item.image_url" transition="scale-transition"/>
            <v-img width="50%" max-height="200" class="rounded-lg ah-cursor-pointer" @click="imageInView = item.proof_url; imageViewDialog = true" :src="item.proof_url" transition="scale-transition"/>
          </div>
          <div class="my-4">
            <v-divider/>
            <div class="my-4">
              <span>Customer Name: <span class="name font-weight-bold">{{item.name}}</span></span>
            </div>
            <v-divider/>
            <div class="my-4 d-flex justify-space-between">
              <span>Time: <span class="time font-weight-bold">{{item.time}}</span></span>
              <span>Date: <span class="time font-weight-bold">{{formatDate(item.date)}}</span></span>
            </div>
            <v-divider/>
            <div class="my-4">
              <span>Status: <span class="status font-weight-bold"><transaction-status :status="item.status"/></span></span>
            </div>
            <v-divider/>
            <div class="my-4 d-flex justify-space-between">
              <span>Amount: <span class="amount font-weight-bold">&#8358;{{item.amount}}</span></span>
              <span>BTC: <span class="amount font-weight-bold">{{item.btc}}</span></span>
            </div>
          </div>
        </v-card-text>
      </v-card-title>
    </v-card>
    <bitcoin-image-view :dialog="imageViewDialog" @close="imageViewDialog = false" :image="imageInView"/>
  </v-dialog>
</template>

<script>
import dateformat from "dateformat"
import TransactionStatus from "@/components/users/TransactionStatus";
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";
export default {
  name: "BitcoinViewMore",
  components: {BitcoinImageView, TransactionStatus},
  data: () => ({
    imageInView: null,
    imageViewDialog: false
  }),
  props: {
    dialog: Boolean,
    item: Object
  },
  methods: {
    formatDate(date) {
      return dateformat(date, 'dd/mm/yy')
    }
  }
}
</script>

<style scoped>

</style>