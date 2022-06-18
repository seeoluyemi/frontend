<template>
    <div class="Sidebar">
        <nav>
          <ul class="nav-list ah-flex ah-flex-col ah-justify-between ah-ml-6 ah-px-6 pt-10">
            <li><router-link :to="'/login'">Buy</router-link></li>
            <li><router-link :to="'/login'">Sell</router-link></li>
            <li><router-link :to="'/about'">About Us</router-link></li>
            <li><router-link :to="'/buy'">Download</router-link></li>
            <li><router-link :to="'/contact'">Contact</router-link></li>
          </ul>
          <ul class="on-board ah-flex ah-flex-col ah-justify-around ah-ml-6 ah-px-6 pt-10">
            <li><router-link :to="{ name: 'Login' }">Log In</router-link></li>
            <li><router-link :to="{ name: 'Register' }">Get Started</router-link></li>
          </ul>
        </nav>
    </div>
</template>

<script>
    export default {
        name: 'Sidebar'
    };
</script>

<style lang="scss" scoped>
@use "./Sidebar";
</style>
