<template>
  <v-dialog v-model="open" persistent max-width="400">
    <v-card>
      <v-card-title>
        <div class="ah-flex ah-justify-between ah-w-full">
          <h4>New Giftcard</h4>
          <v-btn text icon @click="$emit('closeDialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <div class="px-6 py-2 gift__card__form">
        <v-select v-model="selected" outlined :loading="fetchingCards" append-icon="mdi-chevron-down" label="Select Giftcard" placeholder="Select Giftcard"
                  :items="items || []" item-text="title" item-value="id"/>
        <base-input label="Enter Card Type" placeholder="Enter Giftcard Type" :prop-value="formData.enter_card_type" @input="setData" class="mb-8"/>
        <v-autocomplete v-model="countries" chips outlined :loading="fetchingCountries"
                        append-icon="mdi-chevron-down"
                        placeholder="Select Countries" label="Select Countries" :items="fetchedCountries || []" item-text="name" item-value="id">
          <template #selection="{ item }">
            <v-chip :color="$vuetify.theme.themes.light.linear__purple1">
              <div class="ah-flex ah-items-center text--white" style="color: #FFF;"><img class="mr-2" width="30px" height="30px" :src="item.image" :alt="item.slug"/> {{item.name}}</div>
            </v-chip>
          </template>
          <template #item="{ item, on , attrs }">
            <div v-on="on" class="ah-flex ah-items-center" v-bind="attrs"><img class="mr-2" width="30px" height="30px" :src="item.image" :alt="item.slug"/> {{item.name}}</div>
          </template>
        </v-autocomplete>
        <label>Terms and conditions</label>
        <vue-editor
            v-model="terms_and_conditions"
            :editor-toolbar="customToolbar"
            class="mt-3 mb-10"
        />
        <v-checkbox v-if="card" :color="$vuetify.theme.themes.light.deep__purple" v-model="is_available" label="Make Available"/>
        <input-like-upload-button :prop-image="formData.front_image" @file="upload('front', $event)" class="mb-6"/>
<!--        <input-like-upload-button @file="upload('back', $event)" back/>-->
        <div class="ah-flex ah-justify-center my-2">
          <base-button class="my-6" outlined :color="$vuetify.theme.themes.light.linear__purple2" :loading="loading" @click="submit">
            {{card ? 'Update Giftcard' : 'Create Giftcard'}}
          </base-button>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import BaseInput from "@/components/resuables/BaseInput";
import InputLikeUploadButton from "@/components/resuables/InputLikeUploadButton";
import BaseButton from "@/components/resuables/BaseButton";
import {createCardType, getAllAvailableCards, getAllCountries, updateCardType, uploadToAzureViaAlaje} from "@/apis";
import {mapMutations} from "vuex";
import { VueEditor } from "vue2-editor";

export default {
  name: "GiftCardForm",
  components: {BaseButton, InputLikeUploadButton, BaseInput, VueEditor},
  data() {
    return {
      formData: {
        giftCardType: 'cardCode',
        front_image: null,
        back_image: null,
      },
      items: null,
      fetchedCountries: null,
      selected: '',
      countries: [],
      fetchingCards: false,
      fetchingCountries: false,
      loading: false,
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
      terms_and_conditions: '',
      is_available: false
    }
  },
  props: {
    open: Boolean,
    card: Object
  },
  watch: {
    open: {
      handler: async function (value) {
        if (!this.card) {
          if (value) {
            try {
              this.fetchingCards = true
              const {data} = await getAllAvailableCards()
              this.items = data.data.cards
            } catch (e) {
              console.log(e)
            }
            this.fetchingCards = false
          }
        }
        if (value && this.fetchedCountries === null) {
          try {
            this.fetchingCountries = true
            const {data} = await getAllCountries()
            this.fetchedCountries = data.data.countries.reverse()
          } catch (e) {
            console.log(e)
          }
          this.fetchingCountries = false
        }
      }
    },
    card: {
      handler: async function (card) {
        if (card) {
          this.terms_and_conditions = card.terms_condition
          try {
            this.fetchingCards = true
            const {data} = await getAllAvailableCards()
            this.items = data.data.cards
          } catch (e) {
            console.log(e)
            this.$displaySnackbar(e)
            return
          } finally {
            this.fetchingCards = false
          }
          this.selected = this.items.find(item => item.title === card.giftcard_name).id
          this.formData.enter_card_type = card.title
          this.countries = card.countries[0].id
          this.formData.front_image = card.front_image
          this.is_available = card.is_available
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
    setData(value) {
      console.log(value)
      this.formData[value.name] = value.value
    },
    async submit() {
      this.loading = true
      try {
        const {enter_card_type, front_image,} = this.formData

        if (this.formData.front_image instanceof File) {
          const frontFormData = new FormData()
          frontFormData.append('asset_file', front_image)

          const {data: {data: {asset: saved_front_image}}} = await uploadToAzureViaAlaje(frontFormData)
          this.formData.front_image = saved_front_image
        }
        // if (back_image) {
        //   const backFormData = new FormData()
        //   backFormData.append('asset_file', back_image)
        //   const {data: {data: {asset: saved_back_image}}} = await uploadToAzureViaAlaje(backFormData)
        //   this.formData.back_image = saved_back_image
        // }
        if (this.$route.name !== 'EditTypes') {
          const cardTypeResponse = await createCardType(this.selected, {
            title: enter_card_type,
            front_image: this.formData.front_image || '',
            back_image: this.formData.back_image || '',
            countries: [this.countries],
            extra_config: [],
            terms_condition: this.terms_and_conditions
          })
          console.log(cardTypeResponse.data)
          this.setErrorOrSuccessDialog(true)
          this.setErrorOrSuccessTitle('Giftcard Type successfully created')
          this.setErrorOrSuccessMessage('If you wish, you can create giftcard rate peculiar to the type just created.')
          this.setSuccess(true)
          this.formData = {
            giftCardType: 'cardCode',
            front_image: null,
            back_image: null,
          }
          this.terms_and_conditions = ''
          this.countries = []
          this.items = null
          this.selected = ''
          this.formData.enter_card_type = ''
          this.formData.front_image = null
        } else {
          const cardTypeResponse = await updateCardType(this.card.id, {
            title: enter_card_type,
            front_image: this.formData.front_image || '',
            back_image: this.formData.back_image || '',
            countries: [this.countries],
            extra_config: [],
            is_available: this.is_available,
            terms_condition: this.terms_and_conditions
          })
          console.log(cardTypeResponse.data)
          this.setErrorOrSuccessDialog(true)
          this.setErrorOrSuccessTitle('Giftcard Type successfully updated')
          this.setErrorOrSuccessMessage('All rates attached to this type will have the updated version.')
          this.setSuccess(true)
        }
        this.$emit('closeDialog')
      } catch (e) {
        console.log(e, e.response)
      }
      this.loading = false
    },
    upload(type, file) {
      console.log(type, file)
      console.log(file instanceof File)
      if (type === 'front') this.formData.front_image = file
      else this.formData.back_image = file
    }
  }
}
</script>

<style scoped>

</style>