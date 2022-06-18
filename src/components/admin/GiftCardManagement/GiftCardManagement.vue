<template>
  <div class="box pa-6 pa-md-10">
    <div class="mb-0">
      <v-btn v-if="$route.params.status === 'sell' || $route.params.status === 'buy'" :to="{name: 'GiftCardManagement', params: {status: 'card'}}"
             large
             text>
        <v-icon>mdi-chevron-left</v-icon>
        Back
      </v-btn>
    </div>
    <div class="ah-flex ah-flex-col sm:ah-flex-row ah-justify-between mb-10 title-wrapper align-center mx-auto">
      <h4 v-if="$route.params.status !== 'card'" class="mb-2 ah-text-2xl">Giftcards</h4>
      <div v-if="$route.params.status === 'card'" class="ah-flex ah-flex-col sm:ah-flex-row">
        <base-button :color="$vuetify.theme.themes.light.deep__purple" :height="40" :min-height="40"
                     class="mr-0 mr-md-2 mb-2 mb-md-0" outlined @click="openCreateGiftCard = true">+ New Giftcard
        </base-button>
        <base-button :color="$vuetify.theme.themes.light.deep__purple" :height="40" :min-height="40"
                     class="mr-0 mr-md-2 mb-2 mb-md-0" outlined @click="openDialog = true">+ Giftcard Type
        </base-button>
        <base-button :color="$vuetify.theme.themes.light.deep__purple" :height="40"
                     :min-height="40" outlined @click="cardRateDialog = true">+ Giftcard Rate
        </base-button>
        <gift-card-form :open="openDialog" @closeDialog="openDialog = false"/>
        <v-dialog v-model="openCreateGiftCard" max-width="300">
          <v-card>
            <v-card-text>
              <div class="pb-10 pt-6">
                <div class="mb-6 d-flex justify-space-between align-center">
                  <h3>Create Giftcard</h3>
                  <v-btn icon @click="openCreateGiftCard = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                <base-input dense label="Enter Giftcard Name" placeholder="Giftcard Name" @input="setCardTitle"/>
                <div class="ah-flex ah-justify-center mt-6 mb-2">
                  <base-button :color="$vuetify.theme.themes.light.linear__purple2" :loading="createGiftCardLoading"
                               outlined @click="createGiftCard">Create
                    Giftcard
                  </base-button>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <gift-card-rate :dialog="cardRateDialog" @addCard="[fetchCardItems(true)]"
                        @close:rate="cardRateDialog = false"/>
      </div>
      <div>
        <v-btn :color="$vuetify.theme.themes.light.linear__purple1" depressed outlined
               @click="addCardToPoolModal = true">Add Card To Pool
        </v-btn>
      </div>
      <admin-card-sort-modal :dialog="addCardToPoolModal" upload @close="addCardToPoolModal = false"/>
    </div>
    <div class="d-flex justify-space-between">
      <div v-if="$route.params.status !== 'card'" class="title-wrapper mx-auto">
        <div class="title-wrapper" style="width: 230px">
          <v-text-field
              v-model="search"
              :color="$vuetify.theme.themes.light.deep__purple"
              append-icon="mdi-magnify" class="mr-0 mr-md-3"
              dense
              label="Search"
              outlined
              type="search"/>
        </div>
      </div>
      <!--      <rate-calculator-modal :dialog="rateCalculatorDialog" @close:rate-calculator="rateCalculatorDialog = false"/>-->
    </div>
    <card-details-dialog :card="card" :dialog="openCardDetails" @close="openCardDetails = false"
                         @verified="[fetchCardItems(true)]"/>
    <div v-if="$route.params.status === 'sell' || $route.params.status === 'buy'"
         class="ah-table-wrapper mx-auto">
      <div v-if="$route.params.status === 'sell'">
        <div v-if="$route.params.status === 'sell'" class="sell_table_state">
          <div class="d-flex mb-6 justify-space-between">
            <div v-if="tableInView === 'grouping' " class="d-flex">
              <v-btn
                  v-for="(state, i) in sell_table_states"
                  :key="i"
                  :class="[{'active': sell_table_current_state === state.label}, 'mr-2']"
                  :outlined="sell_table_current_state === state.label"
                  text
                  @click="[setTableState(state.label)]">{{ state.label }}
              </v-btn>
            </div>
            <div v-else>
              <v-btn text @click="tableInView = 'grouping'">
                <v-icon left>mdi-chevron-left</v-icon>
                Grouping
              </v-btn>
            </div>
            <div class="d-flex">
              <v-btn :class="[{'white--text': tableInView === 'rejected'}]" :color="'#ff2e2e'"
                     :outlined="tableInView !== 'rejected'" class="text-capitalize mr-3"
                     @click="tableInView = 'rejected'">Rejected
              </v-btn>
              <v-btn :class="[{'white--text': tableInView === 'merchant'}]" :color="$vuetify.theme.themes.light.linear__purple1"
                     :outlined="tableInView !== 'merchant'" class="text-capitalize"
                     @click="tableInView = 'merchant'">Merchant
              </v-btn>
            </div>
          </div>
        </div>
        <div v-if="tableInView === 'grouping'">
          <v-data-table :headers="headers" :items="filteredItems" :items-per-page="8"
                        :loading="fetchingCardItems" :mobile-breakpoint="0" :page="page" :search="search"
                        :sort-desc="true"
                        hide-default-footer sort-by="created_at" @click:row="openDetails">
            <template #item.country.image="{ item }">
              <div class="flag">
                <v-img :src="item.country.image"/>
              </div>
            </template>
            <template #item.rate="{item}">
          <span>
            {{ item && item.rate ? item.rate : '0' }}/$
          </span>
            </template>
            <template #item.created_at="{item}">
          <span>
            {{ formatDate(item.created_at) }}
          </span>
            </template>
            <template #item.updated_at="{item}">
          <span>
            {{ formatDate(item.created_at) }}
          </span>
            </template>
            <template #item.amount="{item}">
          <span>
<!--            &#8358;{{ item.rate && ($numberToAmount(+item.denomination * +item.rate).format('0,0')) }}-->
            &#8358;{{ $numberToAmount(item.amount).format('0,0') }}
          </span>
            </template>
          </v-data-table>
          <v-pagination v-model="page"
                        :color="$vuetify.theme.themes.light.linear__purple1"
                        :length="getLength"
                        :total-visible="6"/>
        </div>
        <div v-else-if="tableInView === 'rejected'">
          <v-data-table :headers="rejectedHeaders" :items="rejectedCards" :items-per-page="8"
                        :loading="fetchingCardItems"
                        :mobile-breakpoint="0" :page="rejectedTablePage" :search="search" :sort-desc="true"
                        hide-default-footer
                        @page-count="rejectedPageCount = $event">
            <template #item.country.image="{ item }">
              <div class="flag">
                <v-img :src="item.country.image"/>
              </div>
            </template>
            <template #item.rate="{item}">
          <span>
            {{ item && item.rate ? item.rate : '0' }}/$
          </span>
            </template>
            <template #item.date="{item}">
          <span>
            {{ formatDate(item.date) }}
          </span>
            </template>
            <template #item.updated_at="{item}">
          <span>
            {{ formatDate(item.date) }}
          </span>
            </template>
            <template #item.amount="{item}">
          <span>
<!--            &#8358;{{ item.rate && ($numberToAmount(+item.denomination * +item.rate).format('0,0')) }}-->
            &#8358;{{ $numberToAmount(item.amount).format('0,0') }}
          </span>
            </template>
            <template #item.see_reason="{ item }">
              <td>
                <v-btn :color="$vuetify.theme.themes.light.deep__purple" class="white--text" depressed x-small
                       @click.stop="[viewReason(item)]">View Reason
                </v-btn>
              </td>
            </template>
          </v-data-table>
          <v-pagination v-model="rejectedTablePage"
                        :color="$vuetify.theme.themes.light.linear__purple1"
                        :length="rejectedPageCount"
                        :total-visible="6"/>
        </div>
        <div v-else-if="tableInView === 'merchant'">
          <v-data-table :headers="merchantTableHeaders" :items="merchantItems" :items-per-page="8"
                        :loading="fetchingCardItems"
                        :mobile-breakpoint="0"
                        :page="merchantTablePage" :search="search" :sort-desc="true" hide-default-footer
                        @page-count="merchantTablePageCount = $event"
                        @click:row="onMerchantClickRow">
            <template #item.date="{item}">
          <span>
            {{ formatDate(item.date) }}
          </span>
            </template>
            <template #item.updated_at="{item}">
          <span>
            {{ formatDate(item.date) }}
          </span>
            </template>
            <template #item.amount="{ item }">
            <span>
              &#8358;{{ $numberToAmount(item.amount).format('0,0') }}
            </span>
            </template>
            <template #item.value="{ item }">
            <span>
              ${{ $numberToAmount(item.value).format('0,0') }}
            </span>
            </template>
            <template #item.actions="{ item }">
              <td v-if="item.status === 'rejected'">
                <v-btn :color="$vuetify.theme.themes.light.deep__purple" class="white--text" depressed x-small
                       @click.stop="[viewReason(item)]">View Reason
                </v-btn>
              </td>
              <td v-if="item.status === 'pending'">
                <v-menu min-width="200">
                  <template #activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon>
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-list-item
                        @click="[verifyCard({groupId: item.group.id, transactionId: item.transactionId, itemId: item.itemId})]">
                      Verify
                    </v-list-item>
                    <v-list-item @click="[declineTriggered(item.group.id)]">
                      Decline
                    </v-list-item>
                  </v-card>
                </v-menu>
              </td>
              <td v-if="item.status === 'paid'">
                <v-btn :color="$vuetify.theme.themes.light.linear__purple1" class="white--text" depressed x-small>Paid
                </v-btn>
              </td>
            </template>
          </v-data-table>
          <v-pagination v-model="merchantTablePage"
                        :color="$vuetify.theme.themes.light.linear__purple1"
                        :length="merchantTablePageCount"
                        :total-visible="6"/>
          <v-dialog v-model="viewMoreMerchantTable" max-width="600">
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                <h4>Card</h4>
                <v-btn icon @click="viewMoreMerchantTable = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <div class="d-flex" style="overflow-x: auto">
                  <v-img v-for="(image, i) in merchantCardInView.images" :key="i"
                         :src="image" class="mr-5 ah-cursor-pointer" height="200" width="180"
                         @click="[imageInView = image, bitcoinViewDialog = true]"/>
                </div>
              </v-card-text>
              <v-card-actions class="d-flex justify-center">
                <v-btn class="text-capitalize" outlined @click="downloadAll">
                  <v-icon left>mdi-tray-arrow-down</v-icon>
                  Download all
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <view-rejection-reason-dialog :dialog="rejectionReasonDialog" :image="rejectedCardInView"
                                      @click="rejectionReasonDialog = true" @close="rejectionReasonDialog = false"/>
        <admin-card-sort-modal :card="card" :dialog="cardSortModal"
                               @close="cardSortModal = false" @decline="[declineTriggered($event)]" @fetch-cards="[fetchCardItems()]"/>
      </div>
      <div v-else>
        <v-data-table
            :headers="buyHeaders"
            :items="filteredBuyItems"
            :loading="fetchingBuyItems"
            :mobile-breakpoint="0"
            sort-by="created_at"
            hide-default-footer
        >
          <template #item.created_at="{item}">
          <span>
            {{ formatDate(item.created_at) }}
          </span>
          </template>
          <template #item.updated_at="{item}">
          <span>
            {{ formatDate(item.created_at) }}
          </span>
          </template>
          <template #item.amount="{item}">
          <span>
<!--            &#8358;{{ item.rate && ($numberToAmount(+item.denomination * +item.rate).format('0,0')) }}-->
            &#8358;{{ $numberToAmount(item.amount).format('0,0') }}
          </span>
          </template>
        </v-data-table>
      </div>
    </div>
    <div v-else class="d-flex justify-space-around ah-w-full sm:ah-w-1/2 mx-auto">
      <div v-for="(option, i) in options" :key="i" :class="`card-wrap ${i === 1 ? 'mr-0' : '' }`">
        <router-link :to="option.link">
          <div :class="`action-card mb-5 ah-flex ah-items-center mt-10 mt-lg-0 ah-justify-center`">
            <span class="gift__card-label">{{ option.label }}</span>
          </div>
          <small class="pt-6 message">{{ option.message }}</small>
        </router-link>
      </div>
    </div>
    <decline-reason-dialog :id="groupId" :dialog="declineReasonDialog" @close="declineReasonDialog = false"
                           @fetch-items="fetchCardItems"/>
    <bitcoin-image-view :dialog="bitcoinViewDialog" :image="imageInView" @close="bitcoinViewDialog = false"/>
  </div>
</template>

<script>
// import ManagementDropdownViewMore from "@/components/admin/ManagementDropdownViewMore";
import {getBuyTransactions} from '@/apis'
import BaseButton from "@/components/resuables/BaseButton";
import GiftCardForm from "@/components/admin/GiftCardForm";
import CardDetailsDialog from "@/components/resuables/CardDetailsDialog";
import BaseInput from "@/components/resuables/BaseInput";
import {createCard, declineCard, getGroupedCards, getUngroupedCards, updateCardVerificationStatus} from "@/apis";
import {mapMutations} from "vuex";
import GiftCardRate from "@/components/admin/GiftCardRate";
// import RateCalculatorModal from "@/components/admin/RateCalculatorModal";
import handleError from "@/utils/errorHandler";
import dateformat from "dateformat";
import AdminCardSortModal from "@/components/admin/GiftCardManagement/AdminCardSortModal";
import DeclineReasonDialog from "@/components/users/History/DeclineReasonDialog";
import ViewRejectionReasonDialog from "@/components/admin/GiftCardManagement/ViewRejectionReasonDialog";
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";

export default {
  name: "GiftCardManagement",
  components: {
    BitcoinImageView,
    ViewRejectionReasonDialog,
    DeclineReasonDialog,
    AdminCardSortModal,
    // RateCalculatorModal,
    GiftCardRate,
    BaseInput,
    CardDetailsDialog,
    GiftCardForm,
    BaseButton,
  },
  data() {
    return {
      openDialog: false,
      cardSortModal: false,
      fetchingBuyItems: false,
      sell_table_current_state: 'Ungrouped Cards',
      sell_table_states: [
        {
          label: 'Ungrouped Cards'
        },
        {
          label: 'In Progress'
        },
        {
          label: 'Grouped Cards'
        },
      ],
      openCardDetails: false,
      openCreateGiftCard: false,
      createGiftCardLoading: false,
      cardRateDialog: false,
      cardTitle: '',
      search: '',
      card: {},
      declineReasonDialog: false,
      groupId: null,
      options: [
        {
          label: 'Buy',
          message: 'These are cards that are bought from the platform',
          link: {name: 'GiftCardManagement', params: {status: 'buy'}}
        },
        {
          label: 'Sell',
          message: 'These are cards that are sold to the platform',
          link: {name: 'GiftCardManagement', params: {status: 'sell'}}
        }
      ],
      rateCalculatorDialog: false,
      headers: [
        {
          text: 'Giftcard',
          value: 'gift_card',
          sortable: false
        },
        {
          text: 'Type',
          value: 'gift_card_type.title',
          sortable: false
        },
        {
          text: 'Amount',
          value: 'amount'
        },
        {
          text: 'Quantity',
          value: 'totalCount'
        },
        {
          text: 'Seller',
          value: 'buyer'
        },
        {
          text: 'Date Created',
          value: 'created_at'
        },
        {
          text: 'Last Modified',
          value: 'updated_at'
        }
      ],
      buyHeaders: [
        {
          text: 'Giftcard',
          value: 'gift_card',
          sortable: false
        },
        {
          text: 'Type',
          value: 'gift_card_type.title',
          sortable: false
        },
        {
          text: 'Amount',
          value: 'amount'
        },
        {
          text: 'Quantity',
          value: 'totalCount'
        },
        {
          text: 'Buyer',
          value: 'buyer'
        },
        {
          text: 'Date Created',
          value: 'created_at'
        },
        {
          text: 'Last Modified',
          value: 'updated_at'
        }
      ],
      items: [],
      fetchingCardItems: false,
      page: 1,
      addCardToPoolModal: false,
      tableInView: 'grouping',
      rejectedHeaders: [
        {
          text: 'Giftcard',
          value: 'giftcard'
        },
        {
          text: 'Type',
          value: 'type'
        },
        {
          text: 'Seller',
          value: 'seller'
        },
        {
          text: 'Date',
          value: 'date'
        },
        {
          text: '',
          value: 'see_reason'
        }
      ],
      rejectedTablePage: 1,
      rejectedCardInView: null,
      rejectionReasonDialog: false,
      rejectedPageCount: null,
      merchantTableHeaders: [
        {
          text: 'Giftcard',
          value: 'giftcard'
        },
        {
          text: 'Type',
          value: 'type'
        },
        {
          text: 'Amount',
          value: 'amount'
        },
        {
          text: 'Value ($)',
          value: 'value'
        },
        {
          text: 'Date',
          value: 'date'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: '',
          value: 'actions'
        }
      ],
      merchantTableItems: [],
      merchantItem: null,
      merchantTablePageCount: null,
      merchantTablePage: 1,
      merchantCardInView: {images: []},
      viewMoreMerchantTable: false,
      bitcoinViewDialog: false,
      imageInView: '',
      buyItems: []
    }
  },
  async created() {
    try {
      this.fetchingBuyItems = true
      const {data: {data: {transaction}}} = await getBuyTransactions()
      console.log(transaction)
      this.buyItems = transaction
      this.fetchingBuyItems = false
      await this.fetchCardItems()
    } catch (e) {
      handleError(e, this)
      this.fetchingBuyItems = false
      this.$displaySnackbar(e)
    }
  },
  methods: {
    ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
    async createGiftCard() {
      this.createGiftCardLoading = true
      try {
        const {data} = await createCard({title: this.cardTitle})
        console.log(data)
        this.openCreateGiftCard = false
        this.setErrorOrSuccessDialog(true)
        this.setErrorOrSuccessTitle('Giftcard successfully created')
        this.setErrorOrSuccessMessage('You can now create giftcard types under this card')
        this.setSuccess(true)
      } catch (e) {
        console.log(e, e.response)
      }
      this.createGiftCardLoading = false
    },
    openDetails(item) {
      console.log(item)
      this.card = item
      if (this.$route.params.status === 'buy') {
        this.openCardDetails = true
      }
      if (this.$route.params.status === 'sell') {
        if (this.sell_table_current_state === 'Grouped Cards') return
        this.cardSortModal = true
      }
    },
    setCardTitle(payload) {
      this.cardTitle = payload.value
    },
    declineTriggered(groupId) {
      console.log('declining')
      this.groupId = groupId
      this.declineReasonDialog = true
    },
    addToItems(card) {
      this.items.push(card)
    },
    getCountryFlag(card) {
      return card && card.countries && card.rate && card.countries.find(country => country.id === card.rate.country_id).image
    },
    async fetchCardItems(silent = false) {
      !silent && (this.fetchingCardItems = true)
      const groupedCardsCall = getGroupedCards()
      const ungroupedCardsCall = getUngroupedCards()
      const [{data: {data: {group: groupedCards}}}, {data: {data: {group: ungroupedCards}}}] = await Promise.all([groupedCardsCall, ungroupedCardsCall])
      !silent && (this.fetchingCardItems = false)
      this.items = this.getSellTableItems(groupedCards.concat(ungroupedCards))
    },
    formatDate: date => dateformat(date, 'dd/mm/yy'),
    customSearch(items, search, filter) {
      console.log(items, search, filter)
      search = search.toString().toLowerCase()
      return this.filteredItems.filter(item => Object.keys(item).some(prop => filter(item[prop], search)))
    },
    getSellTableItems(cards) {
      console.log(cards)

      function getCategory(images) {
        const im = []
        images.forEach(image => im.push(...image))
        if (im.every(image => {
          if (images.length === 4) console.log(image)
          return !image.item_image_group_id
        })) {
          return 'Ungrouped'
        }
        if (im.some(image => !image.item_image_group_id)) {
          return 'In Progress'
        }
        if (im.every(image => image.item_image_group_id)) {
          return 'Grouped'
        }
      }

      return cards
          .filter(transaction => transaction.type === 'sell')
          .map((transaction) => {
            const {item: items, created_at, updated_at, type} = transaction
            let {sell, images} = items[0]
            if (sell === null) {
              return {
                created_at,
                updated_at,
                gift_card: '',
                gift_card_type: {title: ''},
                typeId: 'id',
                status: transaction.progress,
                items,
                totalCount: 0,
                amount: 0,
                ref: transaction.id,
                category: getCategory(items.map(({images}) => (images))),
                countryId: 'Nigeria',
                buyer: '',
                type: 'sell'
              }
            }
            const totalAmount = items.reduce((acc, curr) => acc + (curr.amount * curr.count * curr.sell.rate), 0)
            // const totalAmount = 0
            const totalCount = items.reduce((acc, curr) => acc + curr.count, 0)
            const buyer = images[0].transaction_item.transaction.user.name
            // if (totalCount === 4 && buyer === 'Alaje')
            console.log({transaction})
            return {
              created_at,
              updated_at,
              gift_card: sell.cardtype.giftcard.title,
              gift_card_type: {title: sell.cardtype.title},
              typeId: sell.cardtype.id,
              status: transaction.progress,
              items,
              totalCount,
              amount: totalAmount,
              ref: transaction.id,
              category: getCategory(items.map(({images}) => (images))),
              countryId: sell.country_id,
              buyer,
              type
            }
          })
    },
    setTableState(state) {
      this.sell_table_current_state = state
    },
    viewReason(item) {
      console.log(item)
      this.rejectedCardInView = item
      this.rejectionReasonDialog = true
    },
    onMerchantClickRow(item) {
      console.log(item)
      this.merchantCardInView = item
      this.viewMoreMerchantTable = true
    },
    async declineCard(id) {
      console.log({id})
      this.fetchingCardItems = true
      try {
        const {data} = await declineCard(id, {verification: 'rejected'})
        this.$snackbar.displaySnackbar({message: "You have successfully updated this card", success: true})
        console.log(data)
      } catch (e) {
        this.$displaySnackbar(e)
      } finally {
        this.fetchingCardItems = false
      }
    },
    async verifyCard({groupId, transactionId, itemId}) {
      this.fetchingCardItems = true
      try {
        await updateCardVerificationStatus({id: groupId})
        this.$snackbar.displaySnackbar({message: "You have successfully updated this card", success: true})
        const transaction = this.items.find(item => transactionId === item.ref)
        console.log(transaction)
        const item = transaction.items.find(item => item.id === itemId)
        console.log(item)
        const images = item.images
        console.log(images)
        images.filter(image => image.group.id === groupId).forEach(image => {
          image.verification = 'verified'
          image.group.verification = 'verified'
        })
        await this.fetchCardItems(true)
      } catch (e) {
        this.$displaySnackbar(e)
      } finally {
        this.fetchingCardItems = false
      }
    },
    async downloadAll() {
      for (const image of this.merchantCardInView.images) {
        const res = await fetch(image)
        console.log(res)
        const imageBlob = await res.blob()
        console.log(imageBlob)
        const imageURL = URL.createObjectURL(imageBlob)
        const link = document.createElement('a')
        link.setAttribute('download', 'merchant-card')
        link.setAttribute('href', imageURL)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  },
  computed: {
    filteredItems() {
      let items = []
      const states = {
        'Grouped Cards': this.items?.filter(item => item.category === 'Grouped'),
        'Ungrouped Cards': this.items?.filter(item => item.category === 'Ungrouped'),
        'In Progress': this.items?.filter(item => item.category === 'In Progress'),
      }
      items = states[this.sell_table_current_state] ?? items
      return items
    },
    getLength() {
      let length = this.filteredItems.length / 8
      if (this.filteredItems.length % 8 > 0) length++
      return Math.floor(length)
    },
    rejectedCards() {
      const items = []
      if (!this.items.length) return []
      this.items.forEach(item => {
        item.items.forEach(i => {
          i.images.forEach(image => {
            const rejectedCard = {
              giftcard: item.gift_card,
              type: item.gift_card_type.title,
              seller: item.buyer,
              date: image.created_at,
              group: image.group
            }
            if (image.group) {
              if (image.group.payment_status === 'rejected')
                items.push(rejectedCard)
            }
          })
        })
      })
      return items
    },
    merchantItems() {
      const groups = {}
      if (!this.items.length) return []
      this.items.forEach(item => {
        item.items.forEach(i => {
          i.images.forEach(image => {
            if (image.group && image.group.availability === 'merchant') {
              if (groups[image.group.id]) {
                groups[image.group.id] = {
                  ...groups[image.group.id],
                  images: [...groups[image.group.id].images, image.image_url]
                }
              } else {
                groups[image.group.id] = {
                  transactionId: item.ref,
                  itemId: i.id,
                  giftcard: item.gift_card,
                  type: item.gift_card_type.title,
                  status: (function (image) {
                    if (image.group) {
                      return image.group.payment_status
                    }
                    return 'pending'
                  })(image),
                  verification: (function () {
                    if (image.group) {
                      return image.group.verification
                    }
                    return 'unverifiable'
                  })(),
                  date: image.created_at,
                  group: image.group,
                  images: [image.image_url],
                  amount: i.amount * i.sell.rate,
                  value: i.amount
                }
              }
            }
          })
        })
      })
      return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    filteredBuyItems() {
      console.log(this.buyItems)
      return this.buyItems.map(transaction => {
        const {item: items, created_at, updated_at, user} = transaction
        const {rate: item_rate} = items[0]
        const {cardtype} = item_rate
        const amount = items.reduce((acc, curr) => {
          const {rate: {rate, denomination}, count} = curr
          console.log({rate, denomination, count})
          return acc + (rate * denomination * count)
        }, 0)
        const count = items.reduce((acc, curr) => acc + curr.count, 0)
        return {
          gift_card: cardtype.giftcard.title,
          gift_card_type: cardtype,
          buyer: user.name,
          amount,
          totalCount: count,
          created_at,
          updated_at,
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../../assets/styles/mixins';

.table-card {
  width: 80px;
  height: 60px;
  border-radius: 10px;
  padding-top: 5px;
}

.flag {
  width: 40px;
  height: 26px;
  border-radius: 5px;
}

.action-card {
  height: 220px;
  padding: 0 100px;
  border: thin solid var(--v-button__border-base);
  border-radius: 8px;
  transition: all .3s ease-in-out;


  &:hover {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    transform: scale(1.1);

    & .gift__card-label {
      background: initial;
      -webkit-background-clip: initial;
      -webkit-text-fill-color: initial;
      color: white;
      font-size: 1.8em;
    }
  }

  .gift__card-label {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    font-size: 1.4em;
    transition: font-size .3s ease-in-out;
  }
}

.card-wrap {
  max-width: 200px;
  @include mixins.lg {
    margin-right: 120px;
  }
}

.ah-table-wrapper, .title-wrapper {
  width: 100%;

  @include mixins.md {
    width: 80%;
  }
}

.message {
  color: #2b1c1c;
  font-weight: bold;
}
</style>