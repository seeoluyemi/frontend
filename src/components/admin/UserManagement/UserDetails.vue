<template>
  <v-dialog v-model="dialog" max-width="450" @click:outside="$emit('close:userDetails')" @keydown.esc="$emit('close:userDetails')">
    <v-card class="pt-3">
      <v-card-title class="d-flex pb-3 justify-space-between">
        <h3>Profile</h3>
        <v-btn icon @click="$emit('close:userDetails')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="ah-flex ah-justify-center ah-items-center ah-flex-col sm:ah-flex-row sm:ah-justify-start">
          <div class="profile-picture d-flex justify-center align-center mr-2">
            <v-avatar :color="$vuetify.theme.themes.light.deep__purple" :height="$vuetify.breakpoint.smAndDown ? 130 : 160"
                      :width="$vuetify.breakpoint.smAndDown ? 130 : 160">
              <v-img v-if="user.image" :alt="user.name" :src="user.image"/>
              <h1 v-else class="ah-text-white ah-text-5xl">{{ user.name && user.name[0].toUpperCase() }}</h1>
            </v-avatar>
          </div>
          <div class="basic-info mt-2 mt-lg-0 ah-flex ah-flex-col ah-justify-center text-center text-sm-left">
            <h1 class="ah-text-2xl sm:ah-text-4xl">{{ user.name }}</h1>
            <p class="email mt-2 mb-1">{{ user.email }}</p>
            <span><small class="font-weight-bold"
                         style="color: #00E58B; font-size: 18px">{{ user.wallet.disburse_account }}</small></span>
          </div>
        </div>
        <v-divider class="my-3"/>
        <div class="ah-flex ah-items-center justify-space-between flex-wrap">
          <div class="ah-flex ah-items-center my-1">
            <v-icon :color="$vuetify.theme.themes.light.deep__purple">mdi-phone-outline</v-icon>
            <p :style="{ color: $vuetify.theme.themes.light.deep__purple }"
               class="ah-inline mb-0 ml-2 font-weight-bold ah-text-xl">{{ user.phone_number }}</p>
          </div>
          <div class="ah-flex ah-items-center my-1">
            <v-icon :color="$vuetify.theme.themes.light.deep__purple">mdi-wallet-outline</v-icon>
            <p :style="{ color: $vuetify.theme.themes.light.deep__purple }"
               class="ah-inline mb-0 ml-2 font-weight-bold ah-text-xl">
              &#8358;{{ $numberToAmount(user.wallet.current_balance).format('0,0') }}</p>
          </div>
        </div>
        <v-divider class="my-3"/>
        <div class="mt-6">
          <span><small>Joined on:</small><span class="font-weight-bold"> {{ joinedAt }}</span></span>
        </div>
        <div class="actions d-flex justify-space-between ah-flex-wrap align-center mt-6" v-if="user.active">
          <v-btn @click="$emit('credit')" :color="'#00E58B'" class="my-1" depressed outlined>Credit Wallet
          </v-btn>
          <v-btn @click="$emit('debit')" :color="$vuetify.theme.themes.light.linear__purple2" class="my-1" depressed outlined>Debit Wallet
          </v-btn>
          <v-btn @click="$emit('deactivate')" :loading="deactivating" :color="'#FF2E2E'" class="my-1" depressed outlined>Deactivate</v-btn>
        </div>
        <div v-else class="d-flex justify-center text--white">
          <v-btn @click="$emit('reactivate')" :loading="reactivating" :color="'#FF2E2E'" class="my-1 text--white" depressed>Reactivate</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import dateFormat from "dateformat"

export default {
  name: "UserDetails",
  computed: {
    joinedAt() {
      return dateFormat(this.user.created_at, 'dd/mm/yy')
    }
  },
  props: {
    dialog: Boolean,
    user: Object,
    deactivating: Boolean,
    reactivating: Boolean
  }
}
</script>

<style lang="scss" scoped>
.profile-picture {
  width: 160px;
  border-radius: 50%;
}

.email {
  background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.v-btn {
  text-transform: capitalize;
}

.v-btn.text--white {
  color: white;
}

h1 {
  line-height: 1;
}
</style>