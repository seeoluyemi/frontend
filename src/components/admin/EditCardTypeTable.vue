<template>
  <div>
    <v-btn class="px-0 text-capitalize" :color="$vuetify.theme.themes.light.deep__purple" @click="$router.go(-1)" text>
      <v-icon>mdi-chevron-left</v-icon>
      Back
    </v-btn>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="itemsPerPage"
        :loading="loading"
        hide-default-footer
    >
      <template #item.has_rate_buy="{item}">
        <v-checkbox :color="$vuetify.theme.themes.light.linear__purple1" v-model="item.has_rate_buy" :value="item.has_rate_buy" readonly/>
      </template>
      <template #item.has_rate_sell="{item}">
        <v-checkbox :color="$vuetify.theme.themes.light.linear__purple1" v-model="item.has_rate_sell" :value="item.has_rate_sell" readonly/>
      </template>
      <template #item.action="{item}">
        <td>
          <v-btn
              depressed
              outlined
              @click="[card = item, dialog = true]"
              small
              :color="$vuetify.theme.themes.light.linear__purple1">
            Edit
          </v-btn>
        </td>
      </template>
      <template #item.is_available="{item}">
        <v-checkbox :color="$vuetify.theme.themes.light.linear__purple1" v-model="item.is_available" :value="item.is_available" readonly/>
      </template>
    </v-data-table>
    <gift-card-form :card="card" :open="dialog" @closeDialog="dialog = false"/>
  </div>
</template>

<script>
import {getCardTypes} from "@/apis";
import GiftCardForm from "@/components/admin/GiftCardForm";

export default {
  name: "EditCardTypeTable",
  components: {GiftCardForm},
  data: () => ({
    headers: [
      {
        text: 'Giftcard',
        value: 'giftcard_name'
      },
      {
        text: 'Title',
        value: 'title'
      },
      {
        text: 'Buy Rate',
        value: 'has_rate_buy'
      },
      {
        text: 'Sell Rate',
        value: 'has_rate_sell'
      },
      {
        text: '',
        value: 'action'
      },
      {
        text: 'Available',
        value: 'is_available'
      }
    ],
    items: [],
    itemsPerPage: 10,
    loading: false,
    dialog: false,
    card: undefined
  }),
  async created () {
    try {
      this.loading = true
      await this.getCardTypes()
    } catch (e) {
      this.$displaySnackbar(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async getCardTypes () {
      const {data: {data: {card_types}}} = await getCardTypes(this.$route.params.card_id)
      console.log(card_types)
      this.items = card_types
          // .map(({giftcard_name: giftcard, title, has_rate_buy: has_buy_rate, has_rate_sell: has_sell_rate}) => ({giftcard, title, has_buy_rate, has_sell_rate}))
    }
  }
}
</script>

<style scoped>

</style>