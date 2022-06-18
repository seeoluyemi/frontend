<template>
  <v-dialog v-model="dialog" max-width="450" @click:outside="close" @keypress.esc="close">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h4>Rejection Reason</h4>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="d-flex">
          <div class="mr-1 ah-cursor-pointer" v-for="(image, i) in image.group.proof" :key="i" @click="[imageInView = image.img, imageViewer = true]">
            <v-img class="rounded" width="90" :src="image.img"/>
          </div>
        </div>
        <div class="mt-3" v-html="image.group.rejection_reason"/>
      </v-card-text>
    </v-card>
    <bitcoin-image-view :image="imageInView" :dialog="imageViewer" @close="imageViewer = false" />
  </v-dialog>
</template>

<script>
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";
export default {
  name: "ViewRejectionReasonDialog",
  components: {BitcoinImageView},
  data: () => ({
    imageViewer: false,
    imageInView: null
  }),
  props: {
    image: Object,
    dialog: Boolean
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>