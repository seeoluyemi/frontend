<template>
  <v-row>
    <v-col cols="12" lg="5" md="6">
      <div class="box bitcoin-rate-box ah-flex ah-justify-between ah-flex-col">
<!--        <div>-->
<!--          <div class="ah-flex ah-items-center ah-justify-between">-->
<!--            <h5>Bitcoin Rate</h5>-->
<!--            <h5 class="bitcoin-rate ah-text-green">{{ bitcoinRate }}</h5>-->
<!--          </div>-->
<!--          <h2 class="btc-in-naira ah-text-3xl md:ah-text-4xl my-3 ah-inline-block">&#8358;{{ btcInNaira }}</h2>-->
<!--          <small class="ah-font-bold ml-2">Per BTC</small>-->
<!--        </div>-->
        <v-data-table disable-sort hide-default-footer :items="bitcoinRate" :headers="headers">
          <template #item.rate="{ item }">
            <span>&#8358;{{$numberToAmount(item.rate).format('0,0')}}</span>
          </template>
          <template #item.action="{ item }">
            <v-menu bottom offset-y>
              <template #activator="{ on, attrs }">
                <v-btn icon v-on="on" v-bind="attrs">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-card min-width="140">
                <v-list-item @click="[editBitcoinRate(item)]">Edit</v-list-item>
                <v-list-item @click="[deleteRate(item.id)]">Delete</v-list-item>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
        <div class="ah-flex my-3 ah-items-end ah-justify-end">
          <base-button @click="$emit('add-bitcoin-rate')" :color="$vuetify.theme.themes.light.linear__purple1" :min-height="45" :height="45" outlined>
            Add Bitcoin Rate
          </base-button>
        </div>
      </div>
    </v-col>
    <v-col cols="12" lg="7" md="6">
      <div class="box instructions mb-10">
        <div>
          <h2>How to pay</h2>
          <ol>
            <li v-for="(inst, i) in instructions" :key="i" class="ah-text-sm md:ah-text-lg my-6 my-md-3">
              <small>
                {{ inst }}
              </small>
            </li>
          </ol>
        </div>
        <div class="ah-flex my-3 ah-items-end ah-justify-end">
<!--          <base-button @click="$emit('attemptToEditInstruction')" :color="$vuetify.theme.themes.light.linear__purple1" :min-height="45" :height="45" outlined>-->
<!--            Edit Payment Instructions-->
<!--          </base-button>-->
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import BaseButton from "@/components/resuables/BaseButton";
import {mapGetters} from "vuex";
export default {
  name: "BitcoinRate",
  components: {BaseButton},
  data() {
    return {
      instructions: [
        'Enter the amount of Bitcoin you want to sell to Alaje',
        'Transfer the Bitcoin to the wallet ID: kvx9csfgdjsuju4y67473dhjsie83sk',
        'Once the transaction has been made, click the sell bitcoin bitcoin and upload proof of payment',
        'Once transaction has been confirmed, your wallet will be credited',
      ],
      headers: [
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
          value: 'action'
        }
      ],
      // rates: []
    }
  },
  computed: {
    ...mapGetters(['bitcoinRate',]),
    btcInNaira() {
      return this.bitcoinRate
    }
  },
  props: {
    // bitcoinRate: [String, Number]
  },
  methods: {
    editBitcoinRate(item) {
      this.$emit('attemptToEdit', item)
    },
    deleteRate(id) {
      console.log({id})
    }
  }
}
</script>

<style scoped lang="scss">
.bitcoin-rate-box, .instructions {
  height: 306px;
}

.box {
  border: thin solid var(--v-button__border-base);
  padding: 20px;
  border-radius: 10px;
}

.btc-in-naira {
  color: var(--v-linear__purple2-base);
  height: 42px;
}

</style>