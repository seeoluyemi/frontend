<template>
  <span :class="`status-${processedStatus.toLowerCase()}`"><span class="status">{{processedStatus}}</span></span>
</template>

<script>
export default {
name: "TransactionStatus",
  props: {
    status: String
  },
  computed: {
    processedStatus() {
      const {status} = this
      let proStatus;
      if (status.toLowerCase() === 'successful' || status.toLowerCase() === 'completed') {
        proStatus = 'Completed'
      } else if (status.toLowerCase() === 'pending') proStatus = 'Pending'
      else if (status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'declined') proStatus = 'Cancelled'
      return proStatus
    }
  }
}
</script>

<style scoped lang="scss">
.status-pending, .status-successful, .status-cancelled, .status-completed {
  position: relative;
  padding: 10px 16px;
  text-align: center;
  border-radius: 6px;

}

.status-pending {
  background: linear-gradient(95.36deg, rgba(1, 203, 255, 0.15) 1.64%, rgba(1, 147, 255, 0.15) 100%);

  .status {
    background: linear-gradient(90deg, var(--v-card__blue1-base), var(--v-card__blue2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }
}

.status-successful {
  background: linear-gradient(95.36deg, rgba(3, 218, 141, 0.15) 1.64%, rgba(9, 239, 163, 0.15) 100%);
  .status {
    background: linear-gradient(90deg, var(--v-linear__green1-base), var(--v-linear__green2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }
}

.status-completed {
  background: linear-gradient(95.36deg, rgba(3, 218, 141, 0.15) 1.64%, rgba(9, 239, 163, 0.15) 100%);
  .status {
    background: linear-gradient(90deg, var(--v-linear__green1-base), var(--v-linear__green2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }
}

.status-cancelled {
  background: linear-gradient(95.36deg, rgba(244, 161, 54, 0.15) 1.64%, rgba(252, 208, 0, 0.15) 100%);
  .status {
    background: linear-gradient(90deg, var(--v-linear__yellow1-base), var(--v-linear__yellow2-base));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }
}
</style>