<template>
  <v-ons-navigator
    swipeable
    swipe-target-width="50px"
    :page-stack="pageStack"
    :pop-page="storePop"
    :options="options"
    
    :class="{ 'border-radius': borderRadius }"
  ></v-ons-navigator>
</template>

<script>
import Home from "./views/Home.vue";
export default {
  beforeCreate() {
    this.$store.commit("navigator/push", Home);
  },
  mounted(){
    /* iOS or Material Themeing */
    this.$ons.disableAutoStyling();
    this.$ons.platform.select('ios');
    console.log(108)
  },
  data() {
    return {
      shutUp: 0,
    };
  },
  computed: {
    pageStack() {
      return this.$store.state.navigator.stack;
    },
    options() {
      return this.$store.state.navigator.options;
    },
    borderRadius() {
      return new URL(window.location).searchParams.get("borderradius") !== null;
    },
  },
  methods: {
    storePop() {
      this.$store.commit("navigator/pop");
    },
    showPopTip() {
      !this.shutUp &&
        this.$ons.notification
          .toast({
            message: "Try swipe-to-pop from left side!",
            buttonLabel: "Shut up!",
            timeout: 2000,
          })
          .then((i) => (this.shutUp = i === 0));
    },
  },
};
</script>



  



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
