<template>
  <div>
    <div class="d-flex justify-space-between">
      <div>
        <h4>Giftcard</h4>
        <small>This table allows you edit giftcard title</small>
      </div>
      <div>
        <label>Search</label>
        <v-text-field dense outlined v-model="search"/>
      </div>
    </div>
    <div>
      <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="itemsPerPage"
          :loading="loading"
          :search="search"
          :page="page"
          hide-default-footer
          @page-count="pageCount = $event">
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template #item.updated_at="{ item }">
          {{ formatDate(item.updated_at) }}
        </template>
        <template #item.actions="{ item }">
          <td>
<!--            <v-btn :color="$vuetify.theme.themes.light.linear__purple1" outlined x-small @click="[openEditor(item)]">-->
<!--              <small>Edit Card</small>-->
<!--            </v-btn>-->
<!--            <v-btn :color="$vuetify.theme.themes.light.deep_purple" outlined x-small>-->
<!--              <small>Edit Types</small>-->
<!--            </v-btn>-->
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item @click="[openEditor(item)]">Edit Card</v-list-item>
                  <v-list-item :to="{name: 'EditTypes', params: {card_id: item.id}}">View Types</v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </td>
        </template>
      </v-data-table>
      <v-pagination v-model="page" :length="pageCount"/>
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <h4>Edit card</h4>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" @submit.prevent="updateTitle">
            <div>
              <label class="mb-1">Card Title</label>
              <v-text-field v-model="title" class="mt-1" solo/>
            </div>
            <div class="d-flex justify-center">
              <v-btn
                  :color="$vuetify.theme.themes.light.deep__purple"
                  :loading="updating" class="text-capitalize white--text"
                  depressed
                  type="submit">Edit Name
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {getAllAvailableCards, updateGiftcardTitle} from "@/apis";
import dateformat from "dateformat"
import handleError from "@/utils/errorHandler";

export default {
  name: "EditCards",
  data: () => ({
    headers: [
      {
        text: "Title",
        value: 'title'
      },
      {
        text: 'Date Created',
        value: 'created_at'
      },
      {
        text: 'Date Updated',
        value: 'updated_at'
      },
      {
        text: '',
        value: 'actions'
      }
    ],
    items: [],
    loading: false,
    title: '',
    valid: true,
    dialog: false,
    editItem: '',
    updating: false,
    pageCount: 0,
    itemsPerPage: 10,
    page: 1,
    search: ''
  }),
  async created() {
    try {
      this.loading = true
      await this.fetchGiftcard()
    } catch (e) {
      handleError(e, this)
      this.$displaySnackbar(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async fetchGiftcard() {
      const {data: {data: {cards}}} = await getAllAvailableCards()
      console.log(cards)
      this.items = cards
    },
    formatDate(date) {
      return dateformat(date, 'dd/mm/yy')
    },
    formatTime(date) {
      return dateformat(date, 'HH:MM')
    },
    openEditor({id, title}) {
      this.editItem = id
      this.title = title
      this.dialog = true
    },
    async updateTitle() {
      try {
        this.updating = true
        const {data} = await updateGiftcardTitle(this.editItem, {title: this.title})
        this.$snackbar.displaySnackbar({message: "Successfully updated giftcard title", success: true})
        this.items.find(item => item.id === this.editItem).title = this.title
        this.dialog = false
        console.log(data)
      } catch (e) {
        this.$displaySnackbar(e)
      } finally {
        this.updating = false
      }
    }
  }
}
</script>

<style scoped>

</style>