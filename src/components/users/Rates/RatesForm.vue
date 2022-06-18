<template>
  <div>
    <form>
      <div v-for="(info, i) in giftCardInfo" :key="i">
        <label class="ah-font-bold">{{ info.label }}</label>
        <v-autocomplete v-model="select[info.name]"
                        :item-text="info.name === 'COUNTRY' ? 'name' : 'title'"
                        :items="info.options" :label="info.label"
                        :placeholder="info.label"
                        class="mt-3"
                        item-value="id"
                        solo @change="emitChange(info.name)">
          <template #selection="{ item }">
            <div v-if="info.name !== 'COUNTRY'">{{ item.title }}</div>
            <div v-else class="ah-flex ah-items-center">
              <img :alt="item.slug" :src="item.image" class="mr-2" height="30px"
                   width="30px"/>
              {{ item.name }}
            </div>
          </template>
          <template #item="{ item, on, attrs }">
            <div v-if="info.name !== 'COUNTRY'" v-bind="attrs" v-on="on">{{ item.title }}</div>
            <div v-else v-bind="attrs" v-on="on" class="ah-flex ah-items-center">
              <img :alt="item.slug" :src="item.image"
                   class="mr-2" height="30px"
                   width="30px"/> {{ item.name }}
            </div>
          </template>
        </v-autocomplete>
      </div>
      <div class="available-rates" v-if="rates.length !== 0">
        <h5>Available rates</h5>
        <v-row>
          <v-col cols="12" md="4" v-for="(rate, i) in rates" :key="i">
            <div class="rate text-center">${{$numberToAmount(rate.min).format('0,0')}} - ${{$numberToAmount(rate.max).format('0,0')}}</div>
          </v-col>
        </v-row>
      </div>
      <base-input :is-error="amountField.error" :label="amountField.label" :max=" buyRate && buyRate.max"
                  :min="buyRate && buyRate.min" :prop-value="amountField.value" :must-validate="false" :placeholder="amountField.placeholder" class="mb-4" dense
                  type="number" @input="emitValue"/>
    </form>
  </div>
</template>

<script>
import BaseInput from "@/components/resuables/BaseInput";
import {mapGetters} from "vuex";

export default {
  name: "RatesForm",
  components: {BaseInput},
  data() {
    return {
      select: {}
    }
  },
  computed: {
    ...mapGetters(['buyRate']),
    returnText() {
      return item => console.log(item)
    }
  },
  methods: {
    emitChange(name) {
      console.log(name)
      this.clearOthers(name)
      this.emitSelectedItem(name, this.select[name])
    },
    emitValue(payload) {
      this.$emit('input', payload.value)
    },
    emitSelectedItem(name, value) {
      this.$emit('selectItem', {name, value})
    },
    clearOthers(name) {
      console.log(name)
      if (name === 'BRAND') {
        this.select.GIFTCARD = ''
        this.select.COUNTRY = ''
      }
      if (name === 'GIFTCARD') this.select.COUNTRY = ''
      this.emitValue({value: ''})
    }
  },
  props: {
    giftCardInfo: Array,
    amountField: Object,
    rates: Array,
  }
}
</script>

<style scoped lang="scss">
  .available-rates .rate {
    background: var(--v-linear__purple1-base);
    color: white;
    font-weight: bold;
    padding: 4px 5px;
  }
</style>