<template>
  <div>
    <div class="d-flex justify-space-between">
      <h4>All Admins</h4>
      <div class="d-flex align-center">
        <v-text-field v-model="search" class="mr-3" dense hide-details outlined placeholder="Search"/>
        <v-btn :disabled="!canCreateAdmin" :color="$vuetify.theme.themes.light.linear__purple1" depressed @click="createAdminModal = true">
          <v-icon>mdi-plus</v-icon>
          New Admin
        </v-btn>
      </div>
    </div>
    <div class="admins-table mt-5">
      <v-data-table :headers="headers" :page="page" :height="400" :items="items" :items-per-page="7" :loading="fetchingAdmins"
                    :mobile-breakpoint="0" hide-default-footer @click:row="viewAdmin">
        <template #item.actions>
          <admin-view-more @permission="permissionsModal = true"/>
        </template>
      </v-data-table>
      <v-pagination v-model="page"
                    :color="$vuetify.theme.themes.light.linear__purple1"
                    :length="getLength"
                    class="my-4"
                    :total-visible="6"/>
    </div>
    <v-dialog v-model="createAdminModal" max-width="400" @click:outside="createAdminModal = false">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <h5>New Admin</h5>
          <v-btn icon @click="createAdminModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createAdmin">
            <v-text-field v-model="admin_name" class="my-3" hide-details label="Full Name" outlined/>
            <v-text-field v-model="admin_email" class="my-3" hide-details label="Admin Email Address" outlined
                          type="email"/>
            <v-text-field v-model="phone_number" class="my-3" hide-details label="Admin Phone Number" outlined
                          type="number"/>
            <div class="d-flex justify-center">
              <v-btn :color="$vuetify.theme.themes.light.linear__purple1" :loading="creatingAdmin" depressed
                     type="submit">Create Admin
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <admin-profile :fetching-permissions="fetchingAdminPermissions" @deactivate-admin="deactivateAdmin" :deactivating="deactivatingAdmin" :admin="admin" @close="openProfile = false" :dialog="openProfile" @permissions="openPermissionModals"/>
    <permissions-modal :all-permissions="allPermissions" :id="admin.id" :dialog="permissionsModal" :permissions="admin.permissions"
                       @close="permissionsModal = false"/>
  </div>
</template>

<script>
import {createAdmin, fetchAdminPermissions, fetchAllPermissions, fetchAdmins, deactivateAccount} from "@/apis";
import AdminViewMore from "@/components/admin/AdminManagement/AdminViewMore";
import handleError from "@/utils/errorHandler";
import AdminProfile from "@/components/admin/AdminManagement/AdminProfile";
import PermissionsModal from "@/components/admin/AdminManagement/PermissionsModal";
import {mapMutations} from "vuex";

export default {
  name: "AdminManagement",
  components: {PermissionsModal, AdminProfile, AdminViewMore},
  async created() {
    // const allAdmins = this.getAllAdmin()
    const allPermissions = fetchAllPermissions()
    try {
      const [, permissionResponse] = await Promise.all([this.getAllAdmin(), allPermissions])
      this.allPermissions = permissionResponse.data.data.permissions.map(({id, name}) => ({id, name}))
      this.fetchingAdmins = false
    } catch (e) {
      handleError(e, this)
      this.$displaySnackbar(e)
    }
  },
  data: () => ({
    deactivatingAdmin: false,
    search: '',
    createAdminModal: false,
    fetchingAdminPermissions: false,
    items: [],
    page: 1,
    headers: [
      {
        text: 'Full Name',
        value: 'full_name'
      },
      {
        text: 'Email Address',
        value: 'email_address'
      },
      {
        text: 'Phone Number',
        value: 'phone_number'
      },
      // {
      //   text: '',
      //   value: 'actions'
      // }
    ],
    admin_name: '',
    admin_email: '',
    phone_number: '',
    permissionsModal: false,
    creatingAdmin: false,
    fetchingAdmins: false,
    openProfile: false,
    admin: {
      id: null
    },
    allPermissions: []
  }),
  methods: {
    ...mapMutations(['setGlobalModal']),
    async getAllAdmin(silent) {
      !silent && (this.fetchingAdmins = true)
      const adminResponse = await fetchAdmins()
      this.items = adminResponse.data.data.users.map(({name, id, email, phone_number, created_at}) => ({
        full_name: name,
        email_address: email,
        id,
        phone_number,
        created_at
      })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      this.fetchingAdmins = false
      // for (const admin of this.items) {
      //   await this.getAdminPermissions(admin.id)
      // }
    },
    async createAdmin() {
      this.creatingAdmin = true
      try {
        const {data} = await createAdmin({
          name: this.admin_name,
          phone_number: this.phone_number,
          user_type: 'admin',
          email: this.admin_email,
        })
        console.log(data)
        this.clearForm()
        this.createAdminModal = false
        this.setGlobalModal({success: true, message: 'You have successfully added an admin'})
        await this.getAllAdmin(true)
      } catch (e) {
        console.log('failed')
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.creatingAdmin = false
    },
    async deactivateAdmin(admin_id) {
      this.deactivatingAdmin = true
      try {
        await deactivateAccount(admin_id)
        this.openProfile = false
        this.$snackbar.displaySnackbar({success: true, message: 'You have successfully deactivated this user.'})
        await this.getAllAdmin(true)
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.deactivatingAdmin = false
    },
    clearForm() {
      this.phone_number = ''
      this.admin_email = ''
      this.admin_name = ''
    },
    viewAdmin(admin) {
      this.admin = admin
      this.openProfile = true
    },
    openPermissionModals() {
      this.openProfile = false
      this.permissionsModal = true
    },
    async getAdminPermissions(id) {
      try {
        const {data: {data: {permissions}}} = await fetchAdminPermissions(id)
        this.items.find(admin => id === admin.id).permissions = permissions
            .map((permission) => ({id: permission.id, name: permission.permission.name}))
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
    }
  },
  computed: {
    getLength() {
      let length = this.items.length / 8
      if (this.items.length % 8 > 0) length++
      return Math.floor(length)
    },
    canCreateAdmin() {
      const permissions = JSON.parse(localStorage.getItem('permissions'))
      return permissions.includes('create-user')
    }
  },
  watch: {
    async openProfile(dialog) {
      if (dialog) {
        // if (!this.admin.permissions) {
        //
        // }
        this.fetchingAdminPermissions = true
        await this.getAdminPermissions(this.admin.id)
        this.fetchingAdminPermissions = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  color: white;
  text-transform: capitalize;
}
</style>