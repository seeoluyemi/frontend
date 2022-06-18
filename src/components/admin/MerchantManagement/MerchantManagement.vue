<template>
  <div class="box pa-6 pa-md-10">
    <div class="ah-flex ah-flex-col sm:ah-flex-row ah-justify-between">
      <h4 class="mb-5 ah-text-2xl">Giftcards</h4>
      <div class="ah-flex ah-flex-col sm:ah-flex-row">
        <v-select :color="$vuetify.theme.themes.light.deep__purple" :items="[]" class="mr-0 mr-md-3" dense
                  label="Sort by"
                  outlined/>
        <v-text-field :color="$vuetify.theme.themes.light.deep__purple" append-icon="mdi-magnify" dense label="Search"
                      outlined
                      class="mr-0 mr-md-3"
                      type="search"/>
        <base-button outlined :color="$vuetify.theme.themes.light.deep__purple" :height="40" :min-height="40" @click="openDialog = true">+ New Merchant</base-button>

      </div>
    </div>
    <v-data-table :headers="headers" :items="items" hide-default-footer>
      <template #item.selected="{ item }">
        <simple-icon :type="item.selected ? 'checked-box' : 'unchecked-box'"/>
      </template>
      <template #item.actions>
        <management-dropdown-view-more item="user"/>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import SimpleIcon from "@/components/resuables/SimpleIcon";
import ManagementDropdownViewMore from "@/components/admin/ManagementDropdownViewMore";
import BaseButton from "@/components/resuables/BaseButton";

export default {
  name: "GiftCardManagement",
  components: {BaseButton, ManagementDropdownViewMore, SimpleIcon},
  data() {
    return {
      openDialog: false,
      headers: [
        {
          text: 'ID',
          value: 'id',
          sortable: false,
          width: 100,
          align: 'right'
        },
        {
          text: '',
          value: 'selected',
          sortable: false
        },
        {
          text: 'Name',
          value: 'name',
          // align: 'left',
          sortable: false,
        },
        {
          text: 'Actions',
          value: 'actions',
          // width: 300,
          sortable: false,
          align: 'right'
        }
      ],
      items: [
        {
          id: 1,
          selected: true,
          name: 'Biffco Enterprises Ltd.',
        },
        {
          id: 2,
          selected: true,
          name: 'Warbucks Industrial Inc.',
          dollar_value: '$5',
        },
        {
          id: 3,
          selected: true,
          name: '$5 Dollar Gift Card',
          dollar_value: '$5',
        },
        {
          id: 4,
          selected: true,
          name: '$5 Dollar Gift Card',
          dollar_value: '$5',
        },
        {
          id: 5,
          selected: true,
          name: '$5 Dollar Gift Card',
          dollar_value: '$5',
        },
        {
          id: 6,
          selected: true,
          name: '$5 Dollar Gift Card',
          dollar_value: '$5',
        },
      ]
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.table-card {
  width: 80px;
  height: 60px;
  border-radius: 10px;
  padding-top: 5px;
}
</style>