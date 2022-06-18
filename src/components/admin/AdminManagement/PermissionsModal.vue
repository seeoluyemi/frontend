<template>
  <v-dialog v-model="dialog" max-width="400" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h4>Permissions</h4>
        <VBtn @click="$emit('close')" icon>
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </v-card-title>
      <v-card-text>
        <div v-for="(permission, i) in allPermissions" :key="i" class="d-flex justify-space-between align-center">
          <div class="name">{{getPermissionLabel(permission.name)}}</div>
          <v-switch inset v-model="userPermissions[permission.name]"/>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <VBtn @click="saveChanges" :loading="updatingPermission" :color="$vuetify.theme.themes.light.linear__purple1" depressed>Save Changes</VBtn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {capitalizeStr} from "@/utils/helpers";
import _ from "lodash"
import {assignPermission, revokePermission} from "@/apis";
import handleError from "@/utils/errorHandler";

export default {
  name: "PermissionsModal",
  data: () => ({
    userPermissions: {},
    userPermissionsInMemory: {},
    updatingPermission: false,
  }),
  props: {
    dialog: Boolean,
    allPermissions: {
      type: Array,
      default: () => []
    },
    permissions: Array,
    id: String
  },
  watch: {
    allPermissions: {
      handler: function (permissions) {
        if (permissions && permissions.length > 0) {
          permissions.forEach(permission => {
            this.$set(this.userPermissions, permission.name, false)
          })
          this.userPermissionsInMemory = _.cloneDeep(this.userPermissions)
        }
      },
      immediate: true,
      deep: true
    },
    permissions: {
      handler: function (permissions) {
        this.setPermissionsAccordingly(permissions)
      },
      immediate: true
    },
    dialog(dialog) {
      if (dialog) this.setPermissionsAccordingly(this.permissions)
    }
  },
  methods: {
    getPermissionLabel(name) {
      return name.split('-').map(capitalizeStr).join(' ')
    },
    async saveChanges() {
      this.updatingPermission = true
      let userPermissionsKeys = Object.keys(this.userPermissions)
      userPermissionsKeys = userPermissionsKeys.filter(permissionsKey => {
        return this.userPermissions[permissionsKey] !== this.userPermissionsInMemory[permissionsKey]
      })
      console.log(userPermissionsKeys)
      try {
        for (const permissionsKey of userPermissionsKeys) {
          let permissionId = this.allPermissions.find(permission => permission.name === permissionsKey).id
          const actionType = this.userPermissions[permissionsKey].toString()
          if (actionType === 'true') await this.assignPermissionToUser(this.id, permissionId)
          if (actionType === 'false') {
            permissionId = this.permissions.find(permission => permission.name === permissionsKey).id
            await this.revokeUserPermission(permissionId)
          }
        }
        this.$snackbar.displaySnackbar({message: 'You have successfully updated user\'s permissions.', success: true})
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.updatingPermission = false
    },
    async assignPermissionToUser(user_id, permission_id) {
      await assignPermission({user_id, permission_id})
    },
    async revokeUserPermission(permission_id) {
      await revokePermission(permission_id)
    },
    setPermissionsAccordingly(permissions) {
      console.log(permissions)
      if (!permissions) return
      const userPermissionsKeys = Object.keys(this.userPermissions)
      userPermissionsKeys.forEach(key => this.userPermissions[key] = false)
      permissions.forEach(({name}) => {
        this.userPermissions[name] = true
      })
      this.userPermissionsInMemory = _.cloneDeep(this.userPermissions)
    }
  }
}
</script>

<style scoped lang="scss">
.v-btn {
  color: white;
  text-transform: capitalize;
}
</style>