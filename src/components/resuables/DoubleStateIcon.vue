<template>
  <dashboard-icon v-if="type === 'dashboard'" :active="active"/>
  <trade-icon v-else-if="type === 'trade'" :active="active"/>
  <bitcoin-icon v-else-if="type === 'bitcoin'" :active="active"/>
  <history-icon v-else-if="type === 'history'" :active="active"/>
  <rates-icon v-else-if="type === 'rates'" :active="active"/>
  <wallet-icon v-else-if="type === 'wallet'" :active="active"/>
  <settings-icon v-else-if="type === 'settings'" :active="active"/>
  <bell-icon v-else-if="type === 'bell-icon'" :active="active"/>
  <search-icon v-else-if="type === 'search-icon'" :active="active"/>
</template>

<script>
import DashboardIcon from "@/components/resuables/Icons/stateful/DashboardIcon";
import TradeIcon from "@/components/resuables/Icons/stateful/TradeIcon";
import BitcoinIcon from "@/components/resuables/Icons/stateful/BitcoinIcon";
import HistoryIcon from "@/components/resuables/Icons/stateful/HistoryIcon";
import RatesIcon from "@/components/resuables/Icons/stateful/RatesIcon";
import WalletIcon from "@/components/resuables/Icons/stateful/WalletIcon";
import SettingsIcon from "@/components/resuables/Icons/stateful/SettingsIcon";
import BellIcon from "@/components/resuables/Icons/stateful/BellIcon";
import SearchIcon from "@/components/resuables/Icons/stateful/SearchIcon";
export default {
name: "DoubleStateIcon",
  components: {
    SearchIcon,
    BellIcon, SettingsIcon, WalletIcon, RatesIcon, HistoryIcon, BitcoinIcon, TradeIcon, DashboardIcon},
  props: ['type', 'active']
}
</script>

<style scoped>

</style>