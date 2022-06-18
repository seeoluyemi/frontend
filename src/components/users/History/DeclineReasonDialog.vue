<template>
  <v-dialog v-model="dialog" max-width="450" @keypress.esc="closeModal" @click:outside="closeModal">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <h3>Reason for rejection</h3>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <vue-editor class="my-6" v-model="reason" :editor-toolbar="customToolbar"/>
          <div class="d-flex align-center images_display">
            <v-hover v-for="image in images" :key="image.id" v-slot="{ hover }">
              <v-card class="mr-3">
                <div class="cancel__image">
                  <v-btn v-if="hover || $vuetify.breakpoint.smAndDown" icon small @click="[deleteImage(image.id)]">
                    <v-icon color="red">mdi-close</v-icon>
                  </v-btn>
                </div>
                <v-img :src="image.base64" class="rounded" height="130" width="130"/>
              </v-card>
            </v-hover>
          </div>
          <div v-ripple class="d-flex justify-center add_image align-center" @click="addImage">
            <input ref="file_input" class="d-none" type="file" @change="storeImages">
            <div class="d-flex flex-column justify-center align-center">
              <v-icon :size="40">mdi-plus</v-icon>
              <div>
                <small class="font-weight-bold">Add Image</small>
              </div>
            </div>
          </div>
          <v-card-actions class="d-flex justify-center">
            <v-btn :loading="declining" depressed color="#ff2e2e" type="submit">
              Decline Card
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {VueEditor} from "vue2-editor"
import MultipleImageHandler from "@/components/resuables/mixins/MultipleImageHandler";
import {declineCard} from "@/apis";
import handleError from "@/utils/errorHandler";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: "DeclineReasonDialog",
  components: {VueEditor},
  mixins: [MultipleImageHandler],
  data: () => ({
    customToolbar: [
      ["bold", "italic", "underline"],
      [
        {align: ""},
        {align: "center"},
        {align: "right"},
        {align: "justify"}
      ],
      [
        {list: "ordered"},
        {list: "bullet"},
        "link"
      ],
      [{size: ["small", false, "large", "huge"]}]
    ],
    valid: true,
    reason: '',
    declining: false
  }),
  props: {
    dialog: Boolean,
    loading: Boolean,
    id: String
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapMutations(['setGlobalModal']),
    ...mapActions(['getUserTransactions']),
    closeModal() {
      this.$emit('close')
    },
    async submit() {
      if (!this.images.length || !this.reason.trim()) return
      this.declining = true
      try {
        const proofs = await this.uploadImages()
        await this.declineCard(proofs)
        this.closeModal()
        this.$emit('fetch-items')
        this.setGlobalModal({title: 'Thank you for the feedback.', message: 'We\'d get back to you.', success: true})
        this.clearForm()
      } catch (e) {
        this.$displaySnackbar(e)
        handleError(e, this)
      }
      this.declining = false
    },
    async declineCard(proofs) {
      const {id, reason: rejection_reason} = this
      await declineCard(id, {rejection_reason, proofs})
      this.closeModal()
      await this.getUserTransactions(this.user.id)
    },
    clearForm() {
      this.reason = ''
      this.images = []
    }
  }
}
</script>

<style scoped lang="scss">
.add_image {
  height: 130px;
  width: 130px !important;
  background: #cccccc;
  border-radius: 4px;
  cursor: pointer;
}

.cancel__image {
  position: absolute;
  z-index: 2;
  right: -8px;
  top: -8px;

  .v-btn {
    background: #f6f6f6;
  }
}

.images_display {
  //width: 100%;
  overflow-x: auto;
  padding: 5px;
}

.v-btn--depressed {
  color: white;
}
</style>