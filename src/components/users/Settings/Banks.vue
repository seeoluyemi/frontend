<template>
  <div class="banks-table">
    <v-data-table
        :headers="headers"
        :items="[user.account]"
        :loading="loading"
        hide-default-footer
    >

    </v-data-table>
    <div class="ah-flex ah-justify-end">
      <base-button :color="$vuetify.theme.themes.light.linear__purple1" outlined @click="dialog = true">
        <small>{{!user.account ? 'Add Account' : 'Edit Account'}}</small>
      </base-button>
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex justify-space-between mt-3 mb-6">
          <h3>Add Bank Account</h3>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addBank">
            <v-autocomplete v-model="selectedBank" :color="$vuetify.theme.themes.light.button__border" :items="banks"
                            hide-details item-text="name" item-value="name"
                            label="Select Bank" outlined return-object/>
            <base-input v-for="(field, i) in fields" :key="i" :is-error="field.error" :label="field.label"
                        :placeholder="field.placeholder"
                        :prop-value="field.value" :type="field.type" class="my-4"
                        @input="takeInput"/>
            <v-card-actions>
              <base-button :color="$vuetify.theme.themes.light.linear__purple1" :loading="addingBank" block outlined>
                {{!user.account ? 'Add Account' : 'Save Changes'}}
              </base-button>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";
import BaseInput from "@/components/resuables/BaseInput";
import {fetchAllBanks, updateAccountSettings} from "@/apis";
import {mapActions, mapGetters, mapMutations} from "vuex";
import handleError from "@/utils/errorHandler";

export default {
  name: "Banks",
  components: {BaseInput, BaseButton},
  data: () => ({
    formData: {},
    loading: false,
    addingBank: false,
    items: [],
    banks: [],
    selectedBank: {},
    dialog: false,
    headers: [
      {
        text: 'Account Name',
        value: 'account_name',
        sortable: false,
      },
      {
        text: 'Bank',
        value: 'bank_name',
        sortable: false,
      },
      {
        text: 'Account Number',
        value: 'account_number',
      },
    ],
    fields: [
      {
        label: 'Enter Account Number',
        type: 'number',
        placeholder: 'Enter Account Number',
        error: false
      },
      {
        label: 'Account Name',
        type: 'text',
        placeholder: 'Account Name',
        error: false,
        value: ''
      },
      {
        label: 'Enter BVN',
        type: 'number',
        placeholder: 'Enter BVN',
        error: false
      },
    ]
  }),
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    user: {
      handler: function(user) {
        if (user.account) {
          this.fields[0] = {...this.fields[0], value: user.account.account_number}
          this.fields[1] = {...this.fields[1], value: user.account.account_name}
          this.fields[2] = {...this.fields[2], value: user.account.bvn}
          this.selectedBank.name = user.account.account_name
          this.selectedBank.code = user.code
        }
      },
      immediate: true
    }
  },
  async created() {
    // this.loading = true
    try {
      const {data} = await fetchAllBanks()
      console.log(data)
      this.banks = data.data.banks
      this.selectedBank.name = this.user.account.account_name
      this.selectedBank.code = this.user.code
      this.fields.forEach(({label, value}) => {
        this.takeInput({name: label.toLowerCase().split(" ").join("_"), value})
      })
    } catch (e) {
      handleError(e, this)
    }
  },
  methods: {
    ...mapMutations(['setUser', 'setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
    ...mapActions(['fetchUser']),
    async addBank() {
      this.addingBank = true
      const {account_name, enter_account_number: account_number, enter_bvn: bvn} = this.formData
      const {code: bank_code, name: bank_name} = this.selectedBank
      const bodyData = {
        account_name,
        account_number,
        bvn,
        bank_code,
        bank_name
      }
      try {
        await updateAccountSettings(this.user.id, bodyData)
        await this.fetchUser()
        this.dialog = false
        this.setErrorOrSuccessDialog(true)
        this.setErrorOrSuccessTitle('You have successfully added your bank account.')
        this.setErrorOrSuccessMessage('Thank you')
        this.setSuccess(true)
        this.clearFields()
      } catch (e) {
        handleError(e, this)
        this.$displaySnackbar(e)
      }
      this.addingBank = false
    },
    takeInput({name, value}) {
      this.$set(this.formData, name, value)
    },
    clearFields() {
      this.formData.enter_account_number = ''
    }
    // setBank(bank) {
    //   this.$set(this.formData, 'bank_name', bank)
    // }
  }
}
</script>

<style lang="scss" scoped>
.banks-table {
  border: 1px solid #f8f8f8;
  padding: 10px 20px;
  border-radius: 8px;
  min-height: 100px;
}
</style>