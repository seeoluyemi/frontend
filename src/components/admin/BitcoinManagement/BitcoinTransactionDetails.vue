<template>
  <v-dialog v-model="dialog" max-width="400" @click:outside="[$emit('close'), success = false]">
    <v-card>
      <div v-if="!success">
        <v-card-title class="d-flex align-center justify-space-between">
          <h4>Bitcoin proof of transfer</h4>
          <v-btn icon @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="bitcoin__img" style="cursor:pointer;" @click="$emit('viewImg')">
            <v-img transition="fade-in" :alt="item.id" :src="item.image_url"/>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-center align-center" v-if="item.status === 'pending'">
          <v-btn @click="paymentProofModal = true" outlined :color="$vuetify.theme.themes.light.linear__purple1">Accept</v-btn>
          <v-btn @click="decline" :loading="declining" outlined :color="'#FF2E2E'">Decline</v-btn>
        </v-card-actions>
        <v-card-actions v-else class="d-flex justify-center">
          <v-btn :color="$vuetify.theme.themes.light.deep__purple" depressed class="white--text">{{ item.status === 'completed' ? 'Completed' : 'Cancelled' }}</v-btn>
        </v-card-actions>
      </div>
      <div v-else>
        <v-card-title class="text-center d-flex justify-end">
          <v-btn icon @click="() => {this.success = false; $emit('close')}">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="img mx-auto my-3 d-flex justify-center align-center" style="width: 100px">
            <v-img :src="require('../../../assets/images/confetti.svg')" alt="success"/>
          </div>
          <h2 class="my-8 text-center">You have successfully completed this bitcoin transaction</h2>
        </v-card-text>
      </div>
      <v-dialog v-model="paymentProofModal" max-width="450">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <h4>Proof of payment</h4>
            <v-btn icon @click="paymentProofModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="upload d-flex justify-center align-center" :class="{'dashed--border': !img}" v-ripple @click="openExplorer">
              <input type="file" class="d-none" ref="input" @change="takeFile">
              <v-icon v-if="!img">mdi-cloud-upload-outline</v-icon>
              <v-img v-else class="rounded" :src="img" height="200" width="100%"/>
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn :loading="accepting" :color="$vuetify.theme.themes.light.linear__purple1" outlined @click="uploadProof">Accept</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
import {decideBTCTransaction, uploadBTCProofPayment, uploadToAzureViaAlaje} from "@/apis";

export default {
  name: "BitcoinTransactionDetails",
  data: () => ({
    accepting: false,
    declining: false,
    success: false,
    paymentProofModal: false,
    file: null,
    img: ''
  }),
  created() {

  },
  props: {
    dialog: Boolean,
    item: Object
  },
  methods: {
    async accept() {
      await decideBTCTransaction(this.item.id, {progress: 'completed'})
      this.success = true
      this.paymentProofModal = false
      this.$emit('determined')
    },
    async decline() {
      if (this.item.status !== 'pending') {
        this.$displaySnackbar('Action has already been taken on this transaction.')
        return
      }
      this.declining = true
      try {
        await decideBTCTransaction(this.item.id, {progress: 'declined'})
        this.success = true
        this.paymentProofModal = false
        this.$emit('determined')
      } catch (e) {
        this.$displaySnackbar(e)
      }
      this.declining = false
    },
    takeFile({target: {files}}) {
      const file = files[0]
      const fr = new FileReader()
      fr.onload = (e) => {
        this.img = e.target.result
        this.file = file
      }
      fr.readAsDataURL(file)
    },
    async uploadProof() {
      if (this.item.status !== 'pending') {
        this.$displaySnackbar('Action has already been taken on this transaction.')
        return
      }
      if (!this.file) {
        return this.$displaySnackbar("Kindly upload the proof of payment before proceeding")
      }
      try {
        this.accepting = true
        const formData = new FormData()
        formData.append('asset_file', this.file)
        const {data: {data: {asset}}} = await uploadToAzureViaAlaje(formData)
        const {data: {data}} = await uploadBTCProofPayment({bitcoin_transaction_id: this.item.id, img: asset})
        console.log(data)
        await this.accept()
      } catch (e) {
        this.$displaySnackbar(e)
      } finally {
        this.accepting = false
      }
    },
    openExplorer() {
      this.$refs.input.click()
    }
  }
}
</script>

<style scoped lang="scss">
.upload {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  cursor: pointer;
}

.dashed--border {
  border: 1px dashed #333;
}
</style>