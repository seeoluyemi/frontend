<template>
  <div class="my-4 overflow-x-auto">
    <div class="d-flex justify-end">
      <v-menu :close-on-content-click="false" v-if="verification === 'unverifiable' && user.user_type === 'customer'" min-width="140" bottom offset-y>
        <template #activator="{on, attrs}">
          <v-btn icon class="my-3" v-on="on" v-bind="attrs">
            <v-icon color="#2b1c1c" size="35">mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list-item @click="$emit('verify', id)">
            Verify
          </v-list-item>
          <v-list-item @click="[declineDialog = true]">
            Decline
          </v-list-item>
        </v-card>
      </v-menu>
      <div v-else-if="verification === 'verified'">
        <v-btn text class="font-weight-bold" color="green">
          Verified
        </v-btn>
      </div>
      <div v-else-if="verification === 'verification_failed'">
        <v-btn text class="font-weight-bold" color="red">
          Declined
        </v-btn>
      </div>
    </div>
    <div class="d-flex">
      <v-img width="200" height="180" max-width="200" class="mr-3 rounded" v-for="image in images" @click="[openImage(image)]" :key="image.id" :src="image.image_url"/>
    </div>
    <bitcoin-image-view :dialog="openImageViewer" :image="image" @close="openImageViewer = false"/>
    <decline-reason-dialog :dialog="declineDialog" :id="id" @close="closeDeclineDialog"/>
  </div>
</template>

<script>
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";
import DeclineReasonDialog from "@/components/users/History/DeclineReasonDialog";
import {mapGetters} from "vuex";
export default {
  name: "BoughtItemsTransactionImages",
  components: {DeclineReasonDialog, BitcoinImageView},
  data: () => ({
    openImageViewer: false,
    image: null,
    declineDialog: false,
    verifying: false
  }),
  computed: {
    ...mapGetters(['user']),
  },
  props: {
    images: Array,
    id: String,
    verification: String
  },
  methods: {
    openImage(image) {
      this.image = image.image_url
      this.openImageViewer = true
    },
    closeDeclineDialog() {
      this.declineDialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.v-btn--depressed {
  color: white;
  text-transform: capitalize;
}
</style>