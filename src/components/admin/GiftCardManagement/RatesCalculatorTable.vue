<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="items"
        :mobile-breakpoint="0"
        :page="page"
        :loading="loading"
        fixed-header
        hide-default-footer
        height="600"
        @page-count="pageCount = $event">
    <template #item.country="{item}">
      <v-img :src="item.country.image" width="40"/>
    </template>
      <template #item.edit="{item}">
        <td>
          <v-btn x-small @click.stop="[editItem(item)]" depressed color="teal">Edit</v-btn>
        </td>
      </template>
      <template #item.delete="{item}">
        <td>
          <v-btn x-small @click.stop="[attemptDelete(item)]" depressed color="#ff2e2e">Delete</v-btn>
        </td>
      </template>
    </v-data-table>
    <v-pagination v-model="page" :length="pageCount" circle/>
    <rate-calculator-modal :rate-to-edit="itemToEdit" :dialog="dialog" @close:rate-calculator="dialog = false"/>
    <v-dialog v-model="deleteModal" max-width="400" persistent>
      <v-card>
        <v-card-title class="d-flex justify-end">
          <v-icon @click="deleteModal = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <h2>Are you sure you want to delete rate?</h2>
          <p class="error--text">This action is irreversible.</p>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn depressed color="teal" @click="deleteModal = false">No</v-btn>
          <v-btn depressed color="#FF2E2E" :loading="deleting" @click="deleteItem">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {deleteRateCalculator, getAllRates} from "@/apis";
import RateCalculatorModal from "@/components/admin/RateCalculatorModal";
import handleError from "@/utils/errorHandler";
import {capitalizeStr} from "@/utils/helpers";

export default {
  name: "RatesCalculatorTable",
  components: {RateCalculatorModal},
  data: () => ({
    page: 1,
    pageCount: 0,
    loading: false,
    dialog: false,
    deleteModal: false,
    deleting: false,
    headers: [
      {
        text: 'Giftcard',
        value: 'giftcard.title'
      },
      {
        text: 'Sub-category',
        value: 'cardtype.title'
      },
      {
        text: 'Country',
        value: 'country'
      },
      {
        text: 'Type',
        value: 'type'
      },
      {
        text: 'Min',
        value: 'min'
      },
      {
        text: 'Max',
        value: 'max'
      },
      {
        text: 'Rate',
        value: 'rate'
      },
      {
        text: '',
        value: 'edit'
      },
      {
        text: '',
        value: 'delete'
      }
    ],
    items: [],
    itemToEdit: {id: null},
    itemToDelete: {id: null},
  }),
  async created() {
    await this.getAllRatesCalculator()
  },
  methods: {
    editItem(item) {
      console.log(item)
      this.itemToEdit = item
      this.dialog = true
    },
    async deleteItem() {
      this.deleting = true
      try {
        const {data} = await deleteRateCalculator(this.itemToDelete.id)
        console.log(data)
        this.deleteModal = false
        await this.getAllRatesCalculator(true)
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.deleting = false
    },
    attemptDelete(item) {
      this.itemToDelete = item
      this.deleteModal = true
    },
    async getAllRatesCalculator(silent = false) {
      if (!silent) this.loading = true
      const {data: {data: {rates}}} = await getAllRates()
      console.log(rates)
      const resolveRates = rates => {
        const table_set_rates = []
        rates.forEach(rate => {
          console.log(rate.title)
          const cardtype = {title: rate.title, id: rate.id}
          const giftcard = {title: rate.giftcard.title, id: rate.giftcard.id}
          const price_ratings = rate.price_ratings
          const countries = rate.countries
          price_ratings.forEach(({id, rate, min, max, country_id, type, current}) => {
            const country = countries.find(country => country.id === country_id) || {}
            if (current) {
              const price_rating = {
                id,
                cardtype,
                giftcard,
                country,
                min: `$${this.$numberToAmount(min).format('0,0[.]00')}`,
                max: `$${this.$numberToAmount(max).format('0,0[.]00')}`,
                rate,
                type: capitalizeStr(type)
              }
              table_set_rates.push(price_rating)
            }
          })
        })
        return table_set_rates
      }
      this.items = resolveRates(rates)
      if (!silent) this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.v-btn {
  color: white;
}
</style>