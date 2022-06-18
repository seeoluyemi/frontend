<template>
  <div>
    <div class="profile-overview ah-pl-0 sm:ah-pl-10">
      <div class="ah-flex ah-justify-between ah-flex-col lg:ah-flex-row">
        <div class="ah-flex justify-space-between">
          <div class="profile-image mr-5">
            <v-menu>
              <template #activator="{on, attrs}">
                <v-avatar color="#989fd1" size="130" v-bind="attrs" v-on="on">
                  <span v-if="!user.image" class="white--text ah-text-5xl font-weight-bold">{{ getProfilePicture }}</span>
                  <v-img v-else :src="getProfilePicture" :alt="user.firstName"/>
                </v-avatar>
              </template>
              <v-card :elevation="0">
                <v-card-text>
                  <ul class="image-options">
                    <li>
                      <label for="image" class="ah-w-full ah-h-full list">
                        Change profile picture
                        <input id="image" accept="img/*" style="display: none" type="file" @change="uploadImage">
                      </label>
                    </li>
                    <li class="list" @click="profilePictureView = true">
                      <span>View profile picture</span>
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>
          <div>
            <h1 class="ah-text-2xl sm:ah-text-4xl">{{ `${user.firstName} ${user.lastName}` }}</h1>
            <small>{{ user.email }}</small>
            <br>
            <br>
            <base-button :color="$vuetify.theme.themes.light.linear__purple1" height="45" min-height="45" outlined
                         @click="enableEdit"><small>Edit Profile</small>
            </base-button>
          </div>
        </div>
        <div class="ah-flex ah-items-end mt-10 mt-lg-0">
          <base-button :color="$vuetify.theme.themes.light.linear__purple1" :to="{ name: 'ResetPassword', query: { update: 'true' } }" class=""
                       height="47" min-height="47"
                       outlined width="256"><small>Reset Password</small>
          </base-button>
          <base-button :color="$vuetify.theme.themes.light.error" class="ml-2" height="47"
                       min-height="47" outlined width="256"
                       @click="confirmationDialog = true"><small>Deactivate Account</small>
          </base-button>
        </div>
      </div>
      <v-dialog v-model="open" max-width="400">
        <v-card>
          <v-card-title class="ah-flex justify-space-between ah-items-center">Edit Profile <v-btn @click="open = false" icon text>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-card-title>
          <v-card-text>
            <div>
              <div  v-for="(field, i) in fields" :key="i">
                <div v-if="!field.toggle">
                  <base-input
                      v-if="!field.country_code"
                      :disabled="field.label === 'Email Address'"
                      :label="field.label"
                      :prop-value="field.value"
                      :type="field.label !== 'Phone Number' ? 'text' : 'number'"
                      class="mb-6"
                      dense @input="takeInput"/>
                  <div v-else class="mb-4">
                    <label class="font-weight-medium">{{ field.label }}</label>
                    <vue-tel-input :default-country="field.country_code" :value="field.value" @country-changed="fields[3].country_code = $event.dialCode" @input="[takeInput({name: 'phone_number', value: $event})]"/>
                  </div>
                </div>

                <base-input
                  v-else
                            :label="field.label"
                            :has-toggle="field.toggle"
                            class="mb-6"
                            :prop-value="field.value"
                            dense @input="takeInput"/>
              </div>
              <div class="ah-w-full ah-flex justify-center">
                <base-button :color="$vuetify.theme.themes.light.linear__purple1" :loading="loading"
                             outlined @click="saveChanges">Save Changes
                </base-button>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <confirmation-dialog :deactivating="deactivating" :open="confirmationDialog" @close="confirmationDialog = false"
                           @go="deactivateUserAccount"/>
      <v-dialog v-model="profilePictureView" fullscreen>
        <v-card style="overflow-x: hidden; background: rgba(0, 0, 0, .7)">
          <div class="close-modal d-flex justify-end">
            <v-icon @click="profilePictureView = false" color="white" size="60">mdi-close</v-icon>
          </div>
          <div class="ah-h-full d-flex image-view align-center justify-center">
          <v-avatar color="#989fd1" size="330">
            <span v-if="!user.image" class="white--text ah-text-5xl font-weight-bold">{{ getProfilePicture }}</span>
            <v-img v-else :src="getProfilePicture" :alt="user.firstName"/>
          </v-avatar>
        </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import BaseButton from "@/components/resuables/BaseButton";
import BaseInput from "@/components/resuables/BaseInput";
import {deactivateAccount, updateAccount, uploadToAzureViaAlaje} from "@/apis";
import ConfirmationDialog from "@/components/resuables/ConfirmationDialog";
import handleError from "@/utils/errorHandler";

export default {
  name: "ProfileSettings",
  components: {ConfirmationDialog, BaseInput, BaseButton},
  data() {
    return {
      open: false,
      confirmationDialog: false,
      loading: false,
      deactivating: false,
      profilePictureView: false,
      fields: [
        {
          label: 'First Name',
          value: this.$store.getters.user.firstName,
        },
        {
          label: 'Last Name',
          value: this.$store.getters.user.lastName
        },
        {
          label: 'Email Address',
          value: this.$store.getters.user.email
        },
        {
          label: 'Phone Number',
          value: this.$store.getters.user.phone_number,
          country_code: this.$store.getters.user.country_code
        },
        {
          label: 'Enable Two factor',
          toggle:true,
          value: this.$store.getters.user.multifactor_enabled
        },
      ]
    }
  },
  computed: {
    ...mapGetters(['user']),
    inputSpanWidth() {
      return document.querySelector('.input').clientWidth
    },
    getProfilePicture() {
      if (this.user.image) {
        return this.user.image
      } else {
        return this.user.firstName.substring(0, 1).toUpperCase()
      }
    },
  },
  methods: {
    ...mapMutations(['setUser', 'setErrorOrSuccessDialog', 'setErrorOrSuccessTitle', 'setSuccess', 'setUserImage']),
    enableEdit() {
      this.open = true
    },
    takeInput(payload) {
      const {value, name} = payload
      this.fields.find(field => field.label.toLowerCase().split(' ').join('_') === name).value = value
    },
    async saveChanges() {
      this.loading = true
      const $data = {
        name: this.fields[0].value + ' ' + this.fields[1].value,
        phone_number: this.fields[3].value || '',
        multifactor_enabled: this.fields[4].value,
        country_code: this.fields[3].country_code
      }
      try {
        const {data} = await updateAccount($data, this.user.id)
        this.loading = false
        this.setUser(data.data.user)
        this.open = false
        this.setErrorOrSuccessDialog(true)
        this.setErrorOrSuccessTitle('Account Updated Successfully!')
        this.setSuccess(true)
      } catch (e) {
        this.loading = false
        console.log(e)
        handleError(e, this)
      }
    },
    async uploadImage(input) {
      const { files } = input.target
      const imageBeforeUpload = this.user.image
      if (files && files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
          this.setUserImage(e.target.result)
        }
        try {
          reader.readAsDataURL(files[0])
          const imageFormData = new FormData()
          imageFormData.append('asset_file', files[0])
          const {data: {data: {asset}}} = await uploadToAzureViaAlaje(imageFormData)
          const {data: { data: { user } }} = await updateAccount({image: asset}, this.user.id)
          this.setUser(user)
        } catch (e) {
          handleError(e, this)
          this.setUserImage(imageBeforeUpload)
        }
      }
    },
    async deactivateUserAccount() {
      console.log('deactivating')
      this.deactivating = true
      try {
        await deactivateAccount(this.user.id)
        this.deactivating = false
      } catch (e) {
        this.deactivating = false
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
@use '../../../assets/styles/mixins';

.profile-image {
  width: 80px;

  @include mixins.sm {
    width: 120px;
  }
}

.ah-column {
  //max-width: 293px;
  //display: flex;
  //justify-content: center;
  .input {
    max-width: 256px !important;
  }
}

.image-options {
  li {
    cursor: pointer;
    border-radius: 6px;

    &:hover {
      background: #f8f8f8;
    }
  }
  .list {
    padding: 14px;
    margin-top: 10px;

    &:hover {
      background: #f8f8f8;
    }
  }
}

.image-view {
  height: calc(100vh - 120px);
  overflow-y: hidden;
}
</style>