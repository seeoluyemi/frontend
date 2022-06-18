<template>
  <div>
    <v-dialog v-model="dialog" max-width="850" @click:outside="$emit('close')" @keypress.esc="$emit('close')">
      <v-card>
        <v-card-title class="d-flex justify-space-between mb-4">
          <h4>Transaction details</h4>
          <v-icon @click="$emit('close')">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <div>
            <div class="ref_number mb-4">
              Transaction Ref: <span class="font-weight-bold">{{transaction.ref}}</span>
            </div>
            <v-card v-for="(item, i) in transaction.items" :key="i" class="mb-5">
              <v-card-text>
                <div class="d-flex card__item justify-space-around flex-column flex-md-row">
                  <div class="d-flex justify-space-between justify-md-space-around">
                    <div>
                      <div class="item-title">Rate</div>
                      <div>&#8358;{{ item.rate || item.sell.rate }}/$</div>
                    </div>
                    <div>
                      <div class="item-title">Amount</div>
                      <div>&#8358;{{ getTotalAmount(item) }}</div>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between justify-md-space-around">
                    <div>
                      <div class="item-title">Value</div>
                      <div>${{ getValue(item) }}</div>
                    </div>
                    <div>
                      <div class="item-title">Qty</div>
                      <div>{{ item.count }}</div>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between justify-md-space-around" v-if="transaction && transaction.type === 'sell'">
                    <div>
<!--                      <div class="item-title">Progress</div>-->
<!--                      <div :class="['progress', item.progress.toLowerCase()]">{{ getProgress(item.progress) }}</div>-->
                    </div>
                    <div class="d-flex align-end">
                      <v-btn color="purple" outlined small @click="openImage(item.images)">View Images</v-btn>
                    </div>
                  </div>
                  <div v-if="transaction && transaction.type === 'buy'">
                    <v-btn icon @click="[expandDropdown(item.id)]">
                      <v-icon>mdi-chevron-{{ expansions[`s${item.id.split('-').join('_')}`] ? 'up' : 'down' }}</v-icon>
                    </v-btn>
                  </div>
                </div>
                <v-expand-transition>
                  <div v-show="expansions[`s${item.id.split('-').join('_')}`]">
                    <v-card flat v-for="bought in item.boughtItems" :key="bought.id">
                      <bought-items-transaction-images
                          :id="bought.id"
                          :verification="bought.verification"
                          :images="bought.images"
                          @verify="[updateCardVerificationStatus('verified', bought.id)]"/>
                      <v-divider/>
                    </v-card>
                  </div>
                </v-expand-transition>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="imagesModal" max-width="650" @click:outside="imagesModal = false">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <h4>Card Information</h4>
          <v-icon @click="imagesModal = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="images__container">
          <div class="m" v-if="images.length">
            <div v-for="(image, i) in images" :key="i" class="my-3 py-3 border--bottom">
              <div class="d-flex">
                <div class="mr-3 ah-cursor-pointer" @click="[imageInView = image.image_url, imageViewer = true]">
                  <v-img class="rounded" width="160" height="100" :src="image.image_url" :lazy-src="lazySrc" transition="scale-transition"/>
                </div>
                <div class="flex-grow-1">
                  <v-row>
                    <v-col cols="3">
                      <span class="font-weight-bold">Image REF:</span>
                    </v-col>
                    <v-col cols="9">
                      <span class="deep-purple--text">{{image.id}}</span>
                    </v-col>
                    <v-col cols="3">
                      <span class="font-weight-bold">Group REF:</span>
                    </v-col>
                    <v-col cols="9">
                      <span class="purple--text">{{image.group ? image.group.id : 'Not grouped'}}</span>
                    </v-col>
                    <v-col cols="3" class="d-flex align-center">
                      <span class="font-weight-bold">Status:</span>
                    </v-col>
                    <v-col cols="9">
                      <v-row>
                        <v-col cols="6"><span :class="['image__status', getImageStatus(image).toLowerCase()]">{{getImageStatus(image)}}</span></v-col>
                        <v-col cols="6"><v-btn @click="rejectionReasonDialog = true" v-if="getImageStatus(image).toLowerCase() === 'rejected'" class="text-capitalize" :color="$vuetify.theme.themes.light.deep__purple" text>See Reason</v-btn></v-col>
                        <v-dialog v-model="rejectionReasonDialog" max-width="450">
                          <v-card>
                            <v-card-title class="d-flex justify-space-between">
                              <h4>Rejection Reason</h4>
                              <v-btn icon @click="rejectionReasonDialog = false">
                                <v-icon>mdi-close</v-icon>
                              </v-btn>
                            </v-card-title>
                            <v-card-text v-if="image.group">
                              <div class="d-flex">
                                <div class="mr-1 ah-cursor-pointer" v-for="(image, i) in image.group.proof" :key="i" @click="[imageInView = image.img, imageViewer = true]">
                                  <v-img class="rounded" width="70" :src="image.img"/>
                                </div>
                              </div>
                              <div class="mt-5" v-html="image.group.rejection_reason"></div>
                            </v-card-text>
                          </v-card>
                        </v-dialog>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            No Images uploaded for this card.
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <bitcoin-image-view :dialog="imageViewer" :image="imageInView" @close="imageViewer = false" />
  </div>
</template>

<script>
import lazySrc from "@/assets/images/img_lazy_src.png"
import {updateCardVerificationStatus} from "@/apis";
import handleError from "@/utils/errorHandler";
import BoughtItemsTransactionImages from "@/components/users/History/BoughtItemsTransactionImages";
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: "TransactionDetails",
  components: {BitcoinImageView, BoughtItemsTransactionImages},
  data: () => ({
    imagesModal: false,
    images: [],
    lazySrc,
    declining: false,
    verifying: false,
    expansions: {},
    rejectionReasonDialog: false,
    imageInView: {},
    imageViewer: false
  }),
  computed: {
    ...mapGetters(['user']),
  },
  props: {
    transaction: Object,
    dialog: Boolean
  },
  watch: {
    transaction: {
      handler: function (transaction) {
        if (transaction.type === 'buy')
          this.setItemsExpand()
      },
      immediate: true
    }
  },
  methods: {
    openImage(images) {
      this.imagesModal = true
      this.images = images
    },
    getImageStatus(image) {
      const statuses = {
        'paid': 'Verified',
        'pending': 'Pending',
        'rejected': 'Rejected'
      }
      return statuses[image?.group?.payment_status] ?? 'Pending'
    },
    setItemsExpand() {
      console.log('set items')
      this.expansions = {}
      this.transaction.items.forEach(item => {
        console.log(item)
        this.$set(this.expansions, `s${item.id.split('-').join('_')}`, false)
      })
    },
    expandDropdown(id) {
      console.log(id)
      id = `s${id.split('-').join('_')}`
      console.log({id, c: this.expansions[id]})
      this.expansions[id] = !this.expansions[id]
    },
    getProgress(status) {
      let proStatus;
      if (status.toLowerCase() === 'successful' || status.toLowerCase() === 'completed') {
        proStatus = 'Completed'
      } else if (status.toLowerCase() === 'pending') proStatus = 'Pending'
      else if (status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'declined') proStatus = 'Cancelled'
      return proStatus
    },
    getTotalAmount(item) {
      let amount = 0;
      console.log(item)
      if (this.transaction.type === 'sell') {
        amount = item.amount * item.count * item.sell.rate
            // * item.sell.rate
      }
      if (this.transaction.type === 'buy') {
        amount = item.amount * item.count
      }
      return this.$numberToAmount(amount).format('0,0')
    },
    getValue(item) {
      let value = 0
      if (this.transaction.type === 'sell') {
        value = item.amount
      }
      if (this.transaction.type === 'buy') {
        value = item.denomination
      }
      return this.$numberToAmount(value).format('0,0')
    },
    async updateCardVerificationStatus(verification, id) {
      const buttonStates = {
        verified: 'verifying',
        unverifiable: 'declining'
      }

      this[buttonStates[verification]] = true
      try {
        const {data} = await updateCardVerificationStatus({id})
        this.setGlobalModal({title: 'You have successfully completed this transaction.', message: 'Thank you!', success: true})
        await this.getUserTransactions(this.user.id)
        this.$emit('close')
        this.$forceUpdate()
        console.log(data)
      } catch (e) {
        this.$displaySnackbar(e)
        handleError(e, this)
      }
      this[buttonStates[verification]] = false
    },
    ...mapMutations(['setGlobalModal']),
    ...mapActions(['getUserTransactions']),
  }
}
</script>

<style scoped lang="scss">
  .item-title {
    font-weight: bold;
  }

  .images__container {
    max-height: 450px;
    overflow-y: auto;
  }

  .ref_number {
    //background: #6f36c6;
    background: linear-gradient(95.45deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    color: whitesmoke;
    padding: 10px;
    border-radius: 5px;
  }

  .progress {
    font-weight: bold;

    &.pending {
      color: var(--v-card__blue1-base);
    }

    &.successful {
      color: var(--v-linear__green1-base);
    }

    &.completed {
      color: var(--v-linear__green1-base);
    }

    &.cancelled {
      color: var(--v-linear__yellow1-base)
    }
  }

  .card__item {
    & > .d-flex:not(:nth-child(4)) {
      flex: 1 1 0;
    }
  }

  .image__status {
    font-weight: bold;
    &.verified {
      color: var(--v-linear__green1-base);
    }

    &.pending {
      color: var(--v-card__blue1-base);
    }

    &.rejected {
      color: var(--v-linear__yellow1-base)
    }
  }

  .border--bottom {
    border-bottom: 1px solid #ccc;
  }
</style>