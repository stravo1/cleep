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
import Add from "./views/Add.vue";
import LogIn from "./views/LogIn.vue";

export default {
  data() {
    return {
      trigger: false,
    };
  },
  beforeCreate() {
    this.$store.commit("navigator/push", Home);
    this.$ons.disableAutoStyling();
    this.$ons.platform.select("ios");

    navigator.serviceWorker.ready.then((registration) => {
      // At this point, a Service Worker is controlling the current page
      console.log("Service worker registered!");
    });
    navigator.serviceWorker.onmessage = function (evt) {
      const message = evt.data;
      console.log(message + " from service-worker!");
    };
  },
  mounted() {
    this.$store.commit("setLoading", true);
    this.$store.commit("setToast", this.$ons.notification.toast);
    if (localStorage.getItem("refreshToken")) {
      this.signInStateUpdate(true);
    } else {
      this.signInStateUpdate(false);
    }
  },
  data() {
    return {
      loginPushed: false,
      isShare: false,
      signInState: this.$store.state.signInState,
    };
  },
  watch: {
    "$store.state.signInState": function (newState, oldState) {
      this.signInStateUpdate(newState);
    },
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
    async signInStateUpdate(arg) {
      ////console.log("Signed In?", arg)

      this.$store.commit("setSignInState", arg);
      if (!this.$store.state.signInState) {
        this.$store.commit("setLoading", false);
        this.$store.commit("navigator/push", LogIn);
        this.loginPushed = true;
        return;
        // clear intervals
      } else {
        if (this.loginPushed) {
          this.$store.commit("navigator/pop");
          this.loginPushed = false;
        }
        await this.$store.dispatch("getNewToken");
        this.$store.commit("setLoading", false);

        await this.checkShare();
        await this.$store.dispatch("checkInstall");
        if (this.isShare) this.$store.commit("navigator/push", Add);

        if (localStorage.getItem("time") == null) {
          localStorage.setItem("time", JSON.stringify(30));
        }
        var time = parseInt(localStorage.getItem("time"));
        this.$store.commit("setRefreshTime", time);
        setInterval(() => this.$store.dispatch("refresh"), time * 1000);
      }

      //level 1 folders
      //localStorage.setItem('thisDeviceId','1Qo8TQY19PdDd3GPU3wmAmOcw1WByN3lalKkFMHxTwhvCJ-U1ig')
    },
    async checkShare() {
      var lst = [];
      const trigger = await caches.open("trigger");

      trigger.keys().then((requests) => {
        requests.forEach((member) => {
          lst.push(member);
          trigger.delete(member);
        });
        if (lst.length) {
          this.isShare = true;
          this.$store.commit("setIsShare", true);
        }
      });
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
