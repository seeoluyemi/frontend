<template>
  <v-dialog v-model="dialog" max-width="450" @click:outside="$emit('close')" @keypress.esc="$emit('close')">
    <v-card>
      <v-card-title>
        <div class="ah-flex ah-justify-between ah-w-full ah-align-items">
          <h5>View More</h5>
          <v-btn icon @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="ah-flex ah-justify-between ah-align-items ah-w-full">
          <h3 class="font-weight-bold">{{card.title}}</h3>
          <h4 class="dollar-value">{{card.dollar_value}}</h4>
        </div>
        <div class="d-flex images__wrapper mb-4">
          <v-card v-for="image in card.images" class="mr-3" :key="image.id" @click="[displayImage(image)]">
            <v-img width="100" height="80" :src="image.image_url"/>
          </v-card>
        </div>
        <v-divider/>
        <div class="d-flex justify-space-between py-3">
          <h4>Ref: <span>{{card.ref}}</span></h4>
        </div>
        <v-divider/>
        <div class="d-flex justify-space-between py-3">
          <h4>Rate: <span>&#8358;{{card && card.rate && card.rate}}/$</span></h4>
          <h4>Amount: <span>&#8358;{{ ($numberToAmount(+card.amount).format('0,0')) }}</span></h4>
        </div>
        <v-divider/>
        <div class="d-flex justify-space-between py-3">
<!--          <h4>Status: <span class="status" :class="{'verified': isVerified(card)}">{{isVerified(card) ? 'Verified' : 'Unverified'}}</span></h4>-->
          <h4>Value: <span>${{card && card.denomination}}</span></h4>
        </div>
<!--        <v-divider/>-->
<!--        <div class="d-flex justify-space-between py-3">-->
<!--          <div>-->
<!--            <h4>Country</h4>-->
<!--            <div class="d-flex" v-for="(country, index) in getFlags" :key="index">-->
<!--              <div class="country-img">-->
<!--                <v-img :src="country"/>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <div v-if="card.items.length && card.items[0].description">
          <v-divider/>
          <div class="pt-3">
            <h4 class="d-flex">E-Code: <span class="ml-1" v-html="card.items[0].description"/></h4>
          </div>
        </div>
        <v-card-actions class="d-flex justify-center">
<!--          <v-btn :loading="verifying" @click="verifyCard" :disabled="isVerified(card)" depressed :color="$vuetify.theme.themes.light.linear__purple1">-->
<!--            Verify-->
<!--          </v-btn>-->
        </v-card-actions>
      </v-card-text>
    </v-card>
    <bitcoin-image-view :dialog="imageView" :image="image" @close="imageView = false"/>
  </v-dialog>
</template>

<script>
import BitcoinImageView from "@/components/admin/BitcoinManagement/BitcoinImageView";
import {updateCardType} from "@/apis";
import {mapMutations} from "vuex";
export default {
  name: "CardDetailsDialog",
  components: {BitcoinImageView},
  data: () => ({
    image: null,
    imageView: false,
    verifying: false
  }),
  methods: {
    ...mapMutations(['setGlobalModal']),
    isVerified(card) {
      if (!card.gift_card_type) return
      const { gift_card_type: { extra_config }} = card
      if (!extra_config) return
      let isVerified = false
      for (let i = 0; i < extra_config.length; i++) {
        let keys = Object.keys(extra_config[i])
        if (keys[0] === 'verified') {
          isVerified = extra_config[i].verified
          break
        }
      }
      return isVerified
    },
    displayImage(image) {
      this.image = image.image_url
      this.imageView = true
    },
    async verifyCard() {
      this.verifying = true
      try {
        await updateCardType(this.card.id, {extra_config: [{verified: true}]})
        this.$emit('close')
        this.$emit('verified')
        this.setGlobalModal({title: 'Card verified successfully', success: true})
      } catch (e) {
        this.$displaySnackbar(e)
      }
      this.verifying = false
    }
  },
  computed: {
    getFlags() {
      return [this.card.country && this.card.country.image]
    }
  },
  props: {
    dialog: Boolean,
    card: {
      type: Object,
      default: () => ({
        items: []
      })
    },
  }
}
</script>

<style scoped lang="scss">
  .dollar-value {
    background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }

  .card-image {
    width: 100px;
    height: 100%;
  }

  .country-img {
    width: 40px;
  }

  .status {
    background: #ff2e2e;
    color: white;
    border-radius: 3px;
    padding: 4px;
  }

  .verified {
    background: #00c853;
  }

  .v-btn {
    color: white;
    text-transform: capitalize;
  }

  h4 {
    span {
      color: black;
    }
  }

</style>