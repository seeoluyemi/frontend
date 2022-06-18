<template>
  <div style="height: 100%">
    <h4 class="ah-font-bold">Select Giftcard</h4>
    <div v-if="fetchingTypes && cardTypes.length === 0" class="d-flex flex-wrap my-8">
      <v-sheet v-for="i in 5" :key="i" class="mr-3 my-5 giftcard_type">
        <v-skeleton-loader :key="i" :loading="fetchingTypes" height="120" type="card" width="120"/>
      </v-sheet>
    </div>
    <div v-else class="giftcard_type">
      <div v-if="selectedBrand">
        <div v-if="cardTypes.length === 0" class="ah-flex justify-center ah-flex-wrap py-6 ah-h-24">
          <p class="font-weight-bold no-selection">
            No types created under this giftcard yet
          </p>
        </div>
        <div v-else class="ah-flex ah-flex-wrap py-6" :class="{'loading-card': fetchingTypes && cardTypes.length > 0}">
          <div v-for="(card, i) in cardTypes" :key="i" :class="{ 'gift_card-active': card.id === selectedType.id }"
               class="card mr-3 my-5" @click="$emit('select:cardType', card)">
            <div class="card__image card">
              <v-img width="150" height="100" v-if="card.front_image" :src="card.front_image" class="ah-w-full ah-h-full round-image"/>
              <div v-else class="skeleton ah-w-full ah-h-full"/>
            </div>
            <div class="text-center">
              <small class="text-center font-weight-bold my-2">{{ card.title }}</small>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>You haven't selected any giftcard</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "SelectGiftcard",
  data() {
    return {
      loading: false
    }
  },
  props: {
    selectedBrand: Object,
    cardTypes: Array,
    fetchingTypes: Boolean,
    selectedType: Object
  },
}
</script>

<style lang="scss" scoped>
.skeleton {
  background: #F5F5F9;
  transition: all .3s ease-out;
}

.card {
  min-width: 120px;
  max-width: 150px;
  max-height: 120px;
  min-height: 100px;
  border-radius: 4px;
  cursor: pointer;
  transition: all .1s ease-out;
}

.gift_card-active {
  .card__image {
    border: 3px solid var(--v-linear__purple2-base);
    border-radius: 4px;
    height: 100px;
  }
}

.loading-card {
  opacity: .4;
  pointer-events: none;
}

.no-selection {
  color: #ff2e2e;
  font-size: 18px;
}

.giftcard_type {
  height: calc(100% - 20px);
  overflow-y: auto;
}
</style>