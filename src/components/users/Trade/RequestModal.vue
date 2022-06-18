<template>
  <v-dialog v-model="dialog" max-width="400" @click:outside="closeModal" @keypress.esc="closeModal">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <h4>Request for custom card</h4>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="descriptionForm" v-model="valid" lazy-validation @submit.prevent.stop="sendRequest">
          <v-textarea
              v-model="description"
              :color="$vuetify.theme.themes.light.linear__purple1"
              :rules="descriptionFieldRules"
              label="Description"
              outlined/>
          <v-btn :color="$vuetify.theme.themes.light.linear__purple1" :loading="requesting" class="send_request"
                 depressed type="submit">Send Request
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {requestCard} from "@/apis";
import handleError from "@/utils/errorHandler";
import {mapMutations} from "vuex";

export default {
  name: "RequestModal",
  data: () => ({
    valid: true,
    requesting: false,
    description: '',
    descriptionFieldRules: [v => !!v || 'Description field cannot be empty.', v => v.length < 200 || 'Description should not be more than 200 characters.']
  }),
  props: {
    dialog: Boolean
  },
  methods: {
    ...mapMutations(['setGlobalModal']),
    closeModal() {
      this.$emit('close')
    },
    async sendRequest() {
      if (this.$refs.descriptionForm.validate()) {
        console.log(this.$data)
        const {description: request_message} = this
        this.requesting = true
        try {
          await requestCard({request_message})
          this.closeModal()
          this.setGlobalModal({
            success: true,
            title: 'We have successfully received your request.',
            message: 'We will get back to you via email once the request is available.'
          })
        } catch (e) {
          this.$displaySnackbar(e)
          handleError(e, this)
        }
        this.requesting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.send_request {
  color: white !important;
}
</style>