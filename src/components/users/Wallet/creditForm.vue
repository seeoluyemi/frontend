<template>
  <v-dialog v-model="dialog" max-width="400" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="d-flex justify-space-between"><h3>Credit Wallet </h3><v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn> </v-card-title>
      <v-card-text>
        <div>
          <base-input class="mb-4" v-for="(field, index) in fields" :is-error="field.error"
                      :key="index" :label="field.label" :placeholder="field.placeholder"
                      :type="field.type"
                      :prop-value="field.value"
                      @input="takeInput"
                      @valid="makeValid"/>
          <div class="ah-w-full ah-flex ah-justify-center">
            <base-button :disabled="formData.amount < 200 || !formData.amount" :loading="loading" @click="payWithMonnify" outlined :color="$vuetify.theme.themes.light.linear__purple1">
              Credit
            </base-button>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
    import BaseInput from "@/components/resuables/BaseInput";
    import BaseButton from "@/components/resuables/BaseButton";
    import {mapActions, mapGetters, mapMutations} from "vuex";
    export default {
        name: "creditForm",
        components: {BaseButton, BaseInput},
        data: () => ({
            formData: {},
            fields: [
                {
                    label: "Amount",
                    placeholder: 'Amount',
                    type: 'number',
                    error: false,
                    value: ''
                },
            ],
          loading: false,
          isTransactionSuccessful: false
        }),
        props: {
            dialog: Boolean
        },
        computed:{
          ...mapGetters(["user"])
        },
        methods: {
            ...mapActions(['walletCredit', 'getWallet']),
          ...mapMutations(['setErrorOrSuccessDialog', 'setErrorOrSuccessMessage', 'setErrorOrSuccessTitle', 'setSuccess']),
            takeInput(payload) {
                const {name, value} = payload
                this.$set(this.formData, name, value)
            },
            makeValid(label) {
                this.fields.find(field => field.label === label).error = false
            },
            submit() {
                console.log(this.formData)
            },

            async payWithMonnify() {
              this.loading = true
                // eslint-disable-next-line no-undef
                // let addedCharges = ((0.013) * parseFloat(this.formData.amount)).toFixed(2);
                // // eslint-disable-next-line no-unreachable
                // if (addedCharges > 2000.00){
                //     addedCharges = 2000;
                // }
                // eslint-disable-next-line no-unreachable
                let amount = parseFloat(this.formData.amount);
                let reference = '' + Math.floor((Math.random() * 1000000000) + 1)
                const that = this;
                // eslint-disable-next-line no-undef
                MonnifySDK.initialize({
                    amount:  amount,
                    currency: "NGN",
                    reference: reference ,
                    customerFullName: `${that.user.name}`,
                    customerEmail:  `${that.user.email}`,
                    customerMobileNumber:  `${that.user.phone_number}`,
                    apiKey: process.env.VUE_APP_MONNIFY_API_KEY,
                    paymentMethods: ["CARD"],
                    contractCode: process.env.VUE_APP_MONNIFY_CONTRACT_CODE,
                    paymentDescription: "",
                    isTestMode: process.env.VUE_APP_MONNIFY_MODE,

                    onComplete: async function (response) {
                         await that.walletCredit({
                            userId: that.user.id,
                            "amount" : amount,
                            "paymentReference" : reference,
                            "transactionReference" : response.transactionReference
                        });
                        that.isTransactionSuccessful = true
                        that.fields[0].value = ''
                        //Implement what happens when transaction is completed.
                    },
                    // eslint-disable-next-line no-unused-vars
                    onClose: async function (data) {
                      that.loading = false
                      if (that.isTransactionSuccessful) {
                        console.log('transaction successful')
                        that.$emit('close', true)
                        that.setErrorOrSuccessDialog(true)
                        that.setErrorOrSuccessTitle('Your transaction was successful. Thank you!')
                        that.setErrorOrSuccessMessage('Please, be patient, your wallet will be credited soon.')
                        that.setSuccess(true)
                        that.isTransactionSuccessful = false
                        await that.getWallet({userId: that.user.id})
                      }
                    }
                });
            },

            // async
        },
        mounted() {
            const MonnifySDK = document.createElement("script");
            MonnifySDK.setAttribute("src", "https://sandbox.sdk.monnify.com/plugin/monnify.js");
            MonnifySDK.async = true;
            document.head.appendChild(MonnifySDK);
        }
    }
</script>

<style scoped>

</style>