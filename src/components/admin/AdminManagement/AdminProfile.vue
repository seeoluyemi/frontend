<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <h4>Admin Details</h4>
        <VBtn icon @click="!fetchingPermissions && $emit('close')">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </v-card-title>
      <v-card-text>
        <div class="profile-img d-flex justify-center align-center mb-4">
          <v-avatar color="purple" size="80">
            <VImg v-if="admin.image_url" :src="admin.image_url"/>
            <div style="color: white; font-size: 26px" v-else>{{ admin.full_name && admin.full_name.substr(0, 1).toUpperCase() }}</div>
          </v-avatar>
        </div>
        <v-divider/>
        <div class="d-flex my-3">
          <div>
            <span>Full name: <span class="font-weight-bold">{{admin.full_name}}</span></span>
          </div>
        </div>
        <v-divider/>
        <div class="d-flex my-3">
          <div>
            <span>Email Address: <span class="font-weight-bold">{{admin.email_address}}</span></span>
          </div>
        </div>
        <v-divider/>
        <div class="d-flex my-3">
          <div>
            <span>Phone Number: <span class="font-weight-bold">{{admin.phone_number}}</span></span>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <VBtn :disabled="!canCreatePermission" :loading="canCreatePermission && fetchingPermissions" depressed :color="$vuetify.theme.themes.light.linear__purple1" @click="$emit('permissions')">Permissions</VBtn>
        <VBtn depressed :loading="deactivating" :color="'#FF2E2E'" @click="$emit('deactivate-admin', admin.id)">Deactivate</VBtn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AdminProfile",
  computed: {
    canCreatePermission() {
      const permissions = JSON.parse(localStorage.getItem('permissions'))
      return permissions.includes('create-user-permission')
    }
  },
  props: {
    admin: Object,
    dialog: Boolean,
    fetchingPermissions: Boolean,
    deactivating: Boolean
  }
}
</script>

<style scoped lang="scss">
.v-btn {
  color: white;
  text-transform: capitalize;
}
</style>