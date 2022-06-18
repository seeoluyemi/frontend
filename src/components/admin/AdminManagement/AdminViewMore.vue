<template>
  <div>
    <span class="activator" @click="drop = true">View more</span>
    <div v-if="drop" class="ah-absolute ah-shadow-md pa-4 menu-box" v-click-outside="onClickOutside">
      <ul>
        <li v-for="(list, i) in menuList" :key="i" :class="{'deactivate': i === menuList.length - 1}"
            class="my-2 py-2 font-weight-bold ah-list" @click="$emit(list.event)">
          {{ list.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminViewMore",
  props: ['allPermissions', 'adminPermissions'],
  data: () => ({
    drop: false,
    menuList: [
      {
        text: 'View Profile',
        event: 'profile'
      },
      {
        text: 'Assign Permissions',
        event: 'permissions'
      },
      {
        text: 'Deactivate Account',
        event: 'deactivate'
      }
    ]
  }),
  methods: {
    onClickOutside() {
      this.drop = false
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-box {
  width: 230px;
  background: white;
}

.deactivate {
  color: #ff2e2e !important;
}

.ah-list {
  cursor: pointer;

  //&:hover {
  //  background: #eeeeee;
  //}
}
.activator {
  cursor: pointer;
}
</style>