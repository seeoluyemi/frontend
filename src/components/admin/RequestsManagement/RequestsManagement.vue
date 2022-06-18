<template>
  <div class="box pa-6 pa-md-10">
    <div class="ah-flex ah-flex-col sm:ah-flex-row ah-justify-between">
      <!--      <h4 class="mb-5 ah-text-2xl">All Users</h4>-->
      <dashboard-inner-content-state-indicator :links="requestLinks" @change="linkChange"/>
      <div class="ah-flex ah-my-2 sm:ah-my-0 ah-flex-col sm:ah-flex-row">
        <!--        <v-select :color="$vuetify.theme.themes.light.deep__purple" :items="[]" class="mr-0 mr-md-3" dense-->
        <!--                  label="Sort by"-->
        <!--                  outlined/>-->
        <v-text-field v-model="search" :color="$vuetify.theme.themes.light.deep__purple" append-icon="mdi-magnify" dense
                      label="Search" outlined
                      type="search"/>
      </div>
    </div>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="7"
        :loading="loading"
        :mobile-breakpoint="0"
        :page="page"
        :search="search"
        height="400"
        hide-default-footer
        loading-text="Fetching card requests.."
        @click:row="displayRequestsDetails">
      <template #item.updated_at="{ item }">
        <span>{{ $dayjs(item.updated_at) }}</span>
      </template>
      <template #item.actions="{ item }">
        <v-btn class="ah-capitalize" color="purple" depressed text @click.stop="[notifyUser(item.user_id,item.id)]">
          Notify Availability
        </v-btn>
      </template>
    </v-data-table>
    <div class="my-2">
      <v-pagination
          v-model="page"
          :color="$vuetify.theme.themes.light.linear__purple1"
          :length="getLength"
          :total-visible="6"
          circle/>
    </div>

    <request-details/>
  </div>
</template>

<script>
import {fetchAllRequests, notifyUser} from "@/apis";
import dateFormat from "dateformat"
import RequestDetails from "@/components/admin/RequestsManagement/RequestDetails";
import handleError from "@/utils/errorHandler";
import DashboardInnerContentStateIndicator from "@/components/resuables/DashboardInnerContentStateIndicator";

export default {
  name: "RequestsManagement",
  components: {DashboardInnerContentStateIndicator, RequestDetails,},
  data() {
    return {
      page: 1,
      loading: false,
      openUserDetails: false,
      openTransactionDialog: false,
      accountActionType: null,
      transacting: false,
      deactivating: false,
      reactivating: false,
      search: '',
      userLinks: [
        {
          to: {
            name: this.$route.name,
            params: {status: 'active'}
          },
          label: 'Active'
        },
        {
          to: {
            name: this.$route.name,
            params: {status: 'deactivated'}
          },
          label: 'Deactivated'
        }
      ],
      headers: [
        {
          text: 'Request Message',
          value: 'request_message',
          mustSort: true,
        },
        {
          text: 'User',
          value: 'user.name',
          mustSort: true,
        },
        {
          text: 'Day Requested',
          value: 'updated_at'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          align: 'center'
        }
      ],
      requests: [],
      request:{
        id: null,
        request_message: null,
        request_handled: false,
        request_type: null,
        user_id: null,
        created_at: null,
        user: {
          id: null,
          name: null,
          image: null,
          email: null,
          phone_number: null,
          created_at: null
        }
      }
    }
  },
  async created() {
    this.loading = true
    await this.fetchAllRequests()
    this.loading = false
  },
  computed: {
    getLength() {
      let length = this.items.length / 7
      if (this.items.length % 7 > 0) length++
      return Math.floor(length)
    },
    items() {
      return this.requests
    }
  },
  methods: {
    formatDate(date) {
      return dateFormat(date, 'dd/mm/yy')
    },
    async fetchAllRequests() {
      try {
        const {data: {data: {card_request}}} = await fetchAllRequests()
        this.requests = card_request
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
    },
    async notifyUser(userId,requestId){
      try {
        const {data: {data: {notification}}} = await notifyUser(userId,requestId)
        if (notification){
          this.$snackbar.displaySnackbar({success: true, message: 'notification sent successfully'})
          await this.fetchAllRequests()
        }
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
    },
    displayRequestsDetails(request) {
      this.openRequestDetails = true
      this.request = request
    },
    linkChange(status) {
      this.$router.push({
        name: this.$route.name,
        params: {status}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  text-transform: capitalize;
}
</style>