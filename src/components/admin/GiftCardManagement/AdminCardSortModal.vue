<template>
  <v-dialog v-model="dialog" max-width="600" @click:outside="closeModal" @keypress.esc="closeModal">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h4>Add card to pool</h4>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-4">
        <div v-if="upload">
          <div>
            <label>Select Giftcard</label>
            <v-select v-model="gift_card" :items="giftcardList" :loading="fetchingCards" item-text="title" item-value="id"
                      outlined @change="fetchTypes"/>
          </div>
          <!--        <v-select v-model="gift_card" item-text="title" item-value="id" :items="giftcardList" outlined/>-->
          <div>
            <label>Select Subcategory</label>
            <v-select v-model="gift_card_type" :items="giftcardTypeList" :loading="fetchingTypes" item-text="title"
                      item-value="id" outlined @change="setCountries"/>
          </div>
          <div>
            <label>Select Country</label>
            <v-autocomplete v-model="country" :items="countries" item-text="name" item-value="id" outlined
                            @change="fetchCardRates">
              <template #selection="{ item }">
                <div class="ah-flex ah-items-center"><img :alt="item.slug" :src="item.image" class="mr-2" height="30px"
                                                          width="30px"/> {{ item.name }}
                </div>
              </template>
              <template #item="{ item, on , attrs }">
                <div v-bind="attrs" v-on="on" class="ah-flex ah-items-center"><img :alt="item.slug" :src="item.image" class="mr-2"
                                                                                   height="30px" width="30px"/>
                  {{ item.name }}
                </div>
              </template>
            </v-autocomplete>
          </div>
        </div>
        <div class="images_box d-flex mb-4">
          <div v-if="!upload" class="d-flex justify-center align-center">
            <v-menu v-for="(image, i) in card.images" :key="i">
              <template #activator="{ on, attrs }">
                <v-card v-bind="attrs" v-on="on"
                        :class="{'selected': selectedCards.includes(image.id)}"
                        class="single_image__holder mr-3">
                  <v-img :height="selectedCards.includes(image.id) ? 80 : 100"
                         :src="image.image_url" :width="selectedCards.includes(image.id) ? 100 : 130">
                    <div v-if="selectedCards.includes(image.id)" class="d-flex selected_cover justify-center align-center">
                      <v-icon color="white" size="40">mdi-check</v-icon>
                    </div>
                  </v-img>
                </v-card>
              </template>
              <v-card>
                <v-list>
                  <v-list-item @click="[imageDialog = true, imageInView = image.image_url]">View Image</v-list-item>
                  <v-list-item @click="[selectImage(image.id)]">Select Image</v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <bitcoin-image-view :dialog="imageDialog" :image="imageInView" @close="imageDialog = false"/>
          </div>
          <div v-else class="d-flex align-center images_display">
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
            <div v-ripple class="d-flex justify-center add_image align-center" @click="addImage">
              <input ref="file_input" class="d-none" type="file" @change="storeImages">
              <div class="d-flex flex-column justify-center align-center">
                <v-icon :size="40">mdi-plus</v-icon>
                <div>
                  <small class="font-weight-bold">Add Image</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="upload">
          <div v-if="fetchingRates" class="d-flex justify-center align-center">
            <v-progress-circular :color="$vuetify.theme.themes.light.linear__purple1" indeterminate/>
          </div>
          <div v-else>
            <div class="select_rates" v-if="!upload">
              <label>Select Buy Rate</label>
              <v-select v-model="buy_rate" :items="buy_rates" item-text="rate" item-value="id" outlined>
                <template #item="{item}">
                  {{getSelectSlotView(item)}}
                </template>
                <template #selection="{item}">
                  {{getSelectSlotView(item)}}
                </template>
              </v-select>
            </div>
            <v-row v-if="!upload">
              <v-col>
                <label>Verification</label>
                <v-select v-model="verification" :items="verificationTypes" outlined/>
              </v-col>
              <v-col>
                <label>Availability</label>
                <v-select v-model="availability" :items="availabilityTypes" outlined/>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <label>Select Sell Rate</label>
                <v-select v-model="sell_rate" :items="sell_rates" item-text="price_ratings[0].rate" item-value="price_ratings[0].id" outlined>
                  <template #item="{item}">
                    {{getSelectSlotView(item)}}
                  </template>
                  <template #selection="{item}">
                    {{getSelectSlotView(item)}}
                  </template>
                </v-select>
              </v-col>
              <v-col>
                <label>Select Buy Rate</label>
                <v-select v-model="buy_rate" :items="buy_rates" item-text="rate" item-value="id" outlined>
                  <template #item="{item}">
                    {{getSelectSlotView(item)}}
                  </template>
                  <template #selection="{item}">
                    {{getSelectSlotView(item)}}
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <div>
              <label>Amount</label>
              <div>
                <v-text-field
                  v-model="amount"
                  outlined/>
              </div>
            </div>
            <div>
              <label>E-Code</label>
              <vue-editor v-model="description" :editor-toolbar="customToolbar"/>
            </div>
            <v-btn :color="$vuetify.theme.themes.light.linear__purple1" :loading="grouping" block
                   class="white--text mt-3"
                   depressed @click="groupCardsTogether">Add to Pool
            </v-btn>
          </div>
        </div>
        <div v-if="!upload">
          <div v-for="(item, i) in card.items" :key="i" class="my-6">
            <v-card>
              <v-card-title>
                <div class="d-flex justify-space-between ah-w-full" @click="[expandCard(item.id)]">
                  <h4>
                    {{item.count}} {{`item${item.count > 1 ? 's' : ''}`}} of ${{$numberToAmount(item.amount).format('0,0')}} sold at &#8358;{{item.sell.rate}}/$
                    <small>(&#8358;{{$numberToAmount(item.amount * item.count * item.sell.rate).format('0,0')}})</small>
                  </h4>
                  <v-btn icon>
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text>
                <v-expand-transition>
                  <div v-show="itemsResponse[item.id].expand">
                    <div class="d-flex">
                      <v-menu v-for="(image, i) in item.images" :key="i" :class="['menu', getImageStatus(image)]">
                        <template #activator="{ on, attrs }">
                          <div>
                            <v-card v-bind="attrs" v-on="on"
                                    :class="{'selected': itemsResponse[item.id].selectedImages.includes(image.id)}"
                                    class="single_image__holder mr-3">
                              <v-img :height="itemsResponse[item.id].selectedImages.includes(image.id) || image.item_image_group_id ? 80 : 100"
                                     :src="image.image_url" :width="itemsResponse[item.id].selectedImages.includes(image.id) || image.item_image_group_id ? 100 : 130">
                                <div v-if="itemsResponse[item.id].selectedImages.includes(image.id)" class="d-flex selected_cover justify-center align-center">
                                  <v-icon color="white" size="40">mdi-check</v-icon>
                                </div>
                              </v-img>
                            </v-card>
                            <div class="status" :class="[getImageStatus(image).toLowerCase()]">{{getImageStatus(image)}}</div>
                          </div>
                        </template>
                        <v-card>
                          <v-list>
                            <v-list-item @click="[imageDialog = true, imageInView = image.image_url]">View Image</v-list-item>
                            <v-list-item :class="['menu', getImageStatus(image).toLowerCase()]" @click="[selectImage(item.id, image.id)]">Select Image</v-list-item>
                          </v-list>
                        </v-card>
                      </v-menu>
                    </div>
                    <div class="select_rates" v-if="!upload">
                      <label>Select Buy Rate</label>
                      <v-select v-model="response.buy_rate" @change="[setResponseValue(item.id, 'buy_rate', $event)]" :items="buy_rates" item-text="rate" item-value="id" outlined>
                        <template #item="{item}">
                          {{getSelectSlotView(item)}}
                        </template>
                        <template #selection="{item}">
                          {{getSelectSlotView(item)}}
                        </template>
                      </v-select>
                    </div>
                    <v-row v-if="!upload">
                      <v-col>
                        <label>Verification</label>
                        <v-select v-model="response.verification" @change="[setResponseValue(item.id, 'verification', $event)]" :items="verificationTypes" outlined/>
                      </v-col>
                      <v-col>
                        <label>Availability</label>
                        <v-select v-model="response.availability" @change="[setResponseValue(item.id, 'availability', $event)]" :items="availabilityTypes" outlined/>
                      </v-col>
                    </v-row>
                    <div>
                      <label>E-Code</label>
                      <vue-editor @input="[setResponseValue(item.id, 'description', $event)]" :editor-toolbar="customToolbar"/>
                    </div>
                    <v-btn :color="$vuetify.theme.themes.light.linear__purple1" :loading="grouping" block
                           class="white--text mt-3"
                           depressed @click="[groupCardsTogether(item.id)]">Group
                    </v-btn>
                  </div>
                </v-expand-transition>
              </v-card-text>
            </v-card>
            <v-row v-if="upload">
              <v-col>
                <label>Select Sell Rate</label>
                <v-select v-model="sell_rate" :items="sell_rates" item-text="price_ratings[0].rate" item-value="price_ratings[0].id" outlined>
                  <template #item="{item}">
                    {{getSelectSlotView(item)}}
                  </template>
                  <template #selection="{item}">
                    {{getSelectSlotView(item)}}
                  </template>
                </v-select>
              </v-col>
              <v-col>
                <label>Select Buy Rate</label>
                <v-select v-model="buy_rate" :items="buy_rates" item-text="rate" item-value="id" outlined>
                  <template #item="{item}">
                    {{getSelectSlotView(item)}}
                  </template>
                  <template #selection="{item}">
                    {{getSelectSlotView(item)}}
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <div v-if="upload">
              <div>
                <label>E-Code</label>
                <vue-editor @input="[setResponseValue(item.id, 'description', $event)]" :editor-toolbar="customToolbar"/>
              </div>
              <v-btn :color="$vuetify.theme.themes.light.linear__purple1" :loading="grouping" block
                     class="white--text mt-3"
                     depressed @click="[groupCardsTogether(item.id)]">Group
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
      <bitcoin-image-view :dialog="imageDialog" :image="imageInView" @close="imageDialog = false"/>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  addCardToPool,
  getAllAvailableCards,
  getCardRates,
  getCardRatesWithRanges,
  getCardTypes,
  groupCards
} from "@/apis";
import {VueEditor} from "vue2-editor"
import {mapMutations} from "vuex";
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";
import MultipleImageHandler from "@/components/resuables/mixins/MultipleImageHandler";

export default {
  name: "AdminCardSortModal",
  mixins: [MultipleImageHandler],
  components: {
    BitcoinImageView,
    VueEditor,
  },
  data: () => ({
    buy_rates: [],
    amount: '',
    fetchingRates: false,
    selectedCards: [],
    imageDialog: false,
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
    description: '',
    imageInView: null,
    grouping: false,
    availability: '',
    verificationTypes: ['Unverifiable',],
    availabilityTypes: ['Public', 'Merchant'],
    buy_rate: '',
    verification: '',
    images: [],
    sell_rates: [],
    sell_rate: '',
    gift_card: '',
    giftcardList: [],
    gift_card_type: '',
    giftcardTypeList: [],
    fetchingCards: false,
    fetchingTypes: false,
    countries: [],
    country: '',
    declineReasonDialog: false,
    groupId: null,
    itemsResponse: {},
    response: {
      buy_rate: '',
      availability: '',
      verification: '',

    }
  }),
  props: {
    card: Object,
    dialog: Boolean,
    upload: Boolean
  },
  watch: {
    dialog: {
      handler: function (dialog) {
        if (dialog) {
          if (this.card) {
            this.description = this.card.items[0].description
            this.itemsResponse = this.card.items.reduce((acc, curr) => {
              return {
                ...acc,
                [curr.id]: {
                  verification: '',
                  description: '',
                  selectedImages: [],
                  availability: '',
                  buy_rate: '',
                  expand: false
                }
              }
            }, {})
            this.fetchCardRates()
          } else {
            this.fetchGiftCards()
          }
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setGlobalModal']),
    async fetchCardRates() {
      this.fetchingRates = true
      if (this.card) {
        console.log('card')
        try {
          const {data: {data: {card}}} = await getCardRates(this.card.typeId, this.card.countryId)
          this.buy_rates = card
        } catch (e) {
          this.$displaySnackbar(e)
        }
      } else {
        const sellRatesCall = getCardRatesWithRanges(this.gift_card, this.country)
        const buyRatesCall = getCardRates(this.gift_card_type, this.country)
        const [{data: {data: {rates: sellRates}}}, {data: {data: {card: buyRates}}}] = await Promise.all([sellRatesCall, buyRatesCall])
        console.log({sellRates, buyRates})
        this.buy_rates = buyRates
        this.sell_rates = sellRates
      }
      this.fetchingRates = false
    },
    closeModal() {
      this.$emit('close')
    },
    selectImage(itemId, imageId) {
      const selectedCards = this.itemsResponse[itemId].selectedImages
      if (selectedCards.includes(imageId)) {
        this.itemsResponse[itemId].selectedImages = selectedCards.filter(c => c !== imageId)
        return
      }
      selectedCards.push(imageId)
    },
    getSelectSlotView(item) {
      let text = 'Value: $' + item.denomination + ', Rate: N' + item.rate + '/$'
      if (item.price_ratings) {
        const {rate, min, max} = item.price_ratings[0]
        text = `Value: $${min} - $${max}, Rate: N${rate}/$`
      }
      return text
    },
    discardForm(id) {
      console.log({id}, 'discard')
      if (id) {
      //  @todo discard form
        const keys = Object.keys(this.itemsResponse[id])
        keys.forEach(key => {
          this.setResponseValue(id, key, '')
          this.response[key] = ''
        })
        this.response.verification = ''
        this.response.availability = ''
        this.response.buy_rate = ''
      } else {
        this.description = ''
        this.images = []
        this.buy_rate = ''
        this.country = ''
        this.sell_rate = ''
        this.verification = ''
        this.availability = ''
        this.gift_card = ''
        this.gift_card_type = ''
      }
    },
    validateForm() {
      const {images, buy_rate, country, sell_rate, verification, availability, gift_card, gift_card_type, card, selectedCards} = this
      let isValid = true
      if (card) {
        if (!selectedCards.length) {
          this.$displaySnackbar("You haven't selected any image!")
          isValid = false
        } else {
          if (!buy_rate || !verification || !availability) {
            this.$displaySnackbar("Rate or Statuses are missing.")
            isValid = false
          }
        }
      } else {
        if (!images.length) {
          this.$displaySnackbar("Upload at least one image.")
          isValid = false
        }
        if (!buy_rate || !country || !gift_card || !gift_card_type || !sell_rate) {
          this.$displaySnackbar("Kindly confirm that all fields have been filled.")
          isValid = false
        }
      }
      return isValid
    },
    async groupCardsTogether(id) {
      // if (!this.validateForm()) return
      this.grouping = true
      if (this.card) {
        const item = this.itemsResponse[id]
        try {
          const {data} = await groupCards({
            images: item.selectedImages,
            card_trade_rate_id: item.buy_rate,
            availability: item.availability.toLowerCase(),
            verification: item.verification.toLowerCase().split(' ').join('_'),
            description: item.description
          })
          console.log(data)
          // const { data: {group: {id: groupId}} } = data
          this.$emit('fetch-cards')
          this.setGlobalModal({title: 'Cards successfully grouped', success: true})
          this.closeModal()
          this.discardForm(id)
        } catch (e) {
          this.$displaySnackbar(e)
        }
      } else {
        try {
          const images = await this.uploadImages()
          console.log(images)
          const {data} = await addCardToPool({
            image_url: images,
            pricing_rate_id: this.sell_rate,
            verification: 'verified',
            availability: 'public',
            description: this.description,
            card_trade_rate_id: this.buy_rate,
            amount: this.amount
          })
          this.$emit('fetch-cards')
          console.log(data)
          this.discardForm()
          this.closeModal()
          this.$emit('fetch-cards')
          this.setGlobalModal({message: 'Card successfully added to the pool', success: true})
        } catch (e) {
          this.$displaySnackbar(e)
        }
      }
      this.grouping = false
    },
    async fetchGiftCards() {
      this.fetchingCards = true
      try {
        const {data: {data: {cards}}} = await getAllAvailableCards()
        console.log({cards})
        this.giftcardList = cards
      } catch (e) {
        this.$displaySnackbar(e)
      }
      this.fetchingCards = false
    },
    async fetchTypes() {
      this.fetchingTypes = true
      try {
        const {data: {data: {card_types}}} = await getCardTypes(this.gift_card)
        console.log({card_types})
        this.giftcardTypeList = card_types
      } catch (e) {
        this.$displaySnackbar(e)
      }
      this.fetchingTypes = false
    },
    setCountries() {
      const type = this.giftcardTypeList.find(card_type => card_type.id === this.gift_card_type)
      console.log(type)
      this.countries = type.countries
    },
    setResponseValue(id, propertyName, value) {
      console.log({id, propertyName, value})
      this.itemsResponse[id][propertyName] = value
    },
    expandCard (id) {
      let itemsResponseKeys = Object.keys(this.itemsResponse)
      itemsResponseKeys = itemsResponseKeys.filter(key => key !== id)
      itemsResponseKeys.forEach(key => {
        this.itemsResponse[key].expand = false
      })
      console.log(this.itemsResponse[id])
      this.itemsResponse[id].expand = !this.itemsResponse[id].expand
    },
    getImageStatus(image) {
      const statuses = {
        'paid': 'Verified',
        'pending': 'Pending',
        'rejected': 'Rejected'
      }
      return statuses[image?.group?.payment_status] ?? ''
    }
  }
}
</script>

<style lang="scss" scoped>
.select_rates {
  //max-width: 400px;
}

.selected {
  width: 100px !important;
  height: 80px !important;
  transition: all .2s ease;
}

.selected_cover {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
}


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

.status {
  font-weight: bold;
  text-align: center;
  margin-top: 3px;
  &.verified {
    color: green;
  }

  &.pending {
    color: yellow;
  }

  &.rejected {
    color: red;
  }
}

.menu {
  &.verified, &.pending, &.rejected {
    display: none !important;
  }
}
</style>