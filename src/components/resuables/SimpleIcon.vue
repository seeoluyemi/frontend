<template>
  <Facebook v-if="type === 'facebook'"/>
  <Twitter v-else-if="type === 'twitter'"/>
  <Instagram v-else-if="type === 'instagram'"/>
  <arrow-down v-else-if="type === 'arrow-down'"/>
  <closed-eye @click="$emit('click')" v-else-if="type === 'closed-eye'"/>
  <open-eye v-else-if="type === 'open-eye'" @click="$emit('click')"/>
  <checked-box v-else-if="type === 'checked-box'"/>
  <unchecked-box v-else-if="type === 'unchecked-box'"/>
  <hamburger-icon v-else-if="type === 'hamburger'"/>
  <step-check v-else-if="type === 'step-check'"/>
  <increase v-else-if="type === 'increase'"/>
  <decrease v-else-if="type === 'decrease'"/>
  <adidas-legend v-else-if="type === 'adidas-legend'"/>
  <ebay-legend v-else-if="type === 'ebay-legend'"/>
  <amazon-legend v-else-if="type === 'amazon-legend'"/>
  <itunes-legend v-else-if="type === 'itunes-legend'"/>
  <arrow-down-scroller v-else-if="type === 'arrow-down-scroller'"/>
  <error-eye @click="$emit('click')" v-else-if="type === 'error-eye'"/>
  <error-icon v-else-if="type === 'error-icon'"/>
  <wrong-icon v-else-if="type === 'wrong-icon'"/>
  <styled-cancel v-else-if="type === 'styled-cancel'"/>
  <log-out-icon v-else-if="type === 'log-out'"/>
</template>

<script>
import Facebook from "@/components/resuables/Icons/Facebook";
import Twitter from "@/components/resuables/Icons/Twitter";
import Instagram from "@/components/resuables/Icons/Instagram";
import ArrowDown from "@/components/resuables/Icons/ArrowDown";
import ClosedEye from "@/components/resuables/Icons/ClosedEye";
import CheckedBox from "@/components/resuables/Icons/CheckedBox";
import UncheckedBox from "@/components/resuables/Icons/UncheckedBox";
import HamburgerIcon from "@/components/resuables/Icons/HamburgerIcon";
import StepCheck from "@/components/resuables/Icons/StepCheck";
import Increase from "@/components/resuables/Increase";
import Decrease from "@/components/resuables/Icons/Decrease";
import AdidasLegend from "@/components/resuables/Icons/AdidasLegend";
import EbayLegend from "@/components/resuables/Icons/EbayLegend";
import AmazonLegend from "@/components/resuables/Icons/AmazonLegend";
import ItunesLegend from "@/components/resuables/Icons/ItunesLegend";
import OpenEye from "@/components/resuables/Icons/OpenEye";
import ArrowDownScroller from "@/components/resuables/Icons/ArrowDownScroller";
import ErrorEye from "@/components/resuables/Icons/ErrorEye";
import ErrorIcon from "@/components/resuables/Icons/ErrorIcon";
import WrongIcon from "@/components/resuables/Icons/WrongIcon";
import StyledCancel from "@/components/resuables/Icons/StyledCancel";
import LogOutIcon from "@/components/resuables/Icons/LogOutIcon";
export default {
name: "SimpleIcon",
  components: {
    LogOutIcon,
    StyledCancel,
    WrongIcon,
    ErrorIcon,
    ErrorEye,
    ArrowDownScroller,
    OpenEye,
    ItunesLegend,
    AmazonLegend,
    EbayLegend,
    AdidasLegend,
    Decrease,
    Increase,
    StepCheck,
    HamburgerIcon,
    UncheckedBox,
    CheckedBox,
    ClosedEye,
    ArrowDown,
    Instagram,
    Twitter,
    Facebook
  },
  props: {
    type: String
  }
}
</script>

<style scoped>

</style>