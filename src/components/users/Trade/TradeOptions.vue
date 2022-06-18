<template>
  <div class="ah-w-full md:ah-w-2/3 mx-auto ah-text-center ah-h-full pt-12 ah-flex ah-flex-col ah-justify-center">
    <h4 class="ah-text-xl md:ah-text-3xl trade-question">What do you want to do today?</h4>
    <div class="options ah-flex ah-items-center ah-flex-col lg:ah-flex-row ah-justify-center ah-w-full mx-auto my-10">
      <div v-for="(option, i) in options" :key="i" :class="`card-wrap ${i === 1 ? 'mr-0' : '' }`">
        <router-link :to="option.link">
          <div :class="`action-card ah-flex ah-items-center mt-10 mt-lg-0 ah-justify-center`">
            <span class="gift__card-label">{{option.label}}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TradeOptions",
  data() {
    return {
      options: [
        {
          label: 'Buy Giftcards',
          link: {name: 'TradeTransaction', query: { trade_type: 'buy' }}
        },
        {
          label: 'Sell Giftcards',
          link: {name: 'TradeTransaction', query: { trade_type: 'sell' }}
        },
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@use '../../../assets/styles/mixins';

  .trade-question {
    margin-top: -40px;
  }

.card-wrap {
  max-width: 200px;
  @include  mixins.lg {
    margin-right: 120px;
  }
}

  .action-card {
    height: 220px;
    padding: 0 100px;
    border: thin solid var(--v-button__border-base);
    border-radius: 8px;
    transition: all .3s ease-in-out;



    &:hover {
      background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
      transform: scale(1.1);

      & .gift__card-label {
        background: initial;
        -webkit-background-clip: initial;
        -webkit-text-fill-color: initial;
        color: white;
        font-size: 1.8em;
      }
    }

    .gift__card-label {
      background: linear-gradient(90deg, var(--v-linear__purple1-base), var(--v-linear__purple2-base));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
      font-size: 1.4em;
      transition: font-size .3s ease-in-out;
    }
  }

  a {
    text-decoration: none;
  }
</style>