<template>
  <div id="app">
    <NavBar />
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script>
import NavBar from "./components/navbar.vue";

export default {
  components: { NavBar },
  computed: {
    loaded() {
      return this.$store.state.loadState == "loaded";
    }
  }
};
</script>




