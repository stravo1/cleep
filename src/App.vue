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
import LogIn from "./views/LogIn.vue";
import { gapi } from "gapi-script";

var CLIENT_ID =
  "202885509544-6sit8gj5j4abi5kkrh0ija74182bh3e1.apps.googleusercontent.com";
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
// accesses only the appData folder
var SCOPES = "https://www.googleapis.com/auth/drive.appdata";

export default {
  beforeCreate() {
    this.$store.commit("navigator/push", Home);
    this.$ons.disableAutoStyling();
    this.$ons.platform.select("ios");
  },
  mounted() {
    var callback = this.signInStateUpdate;
    this.$store.commit("setLoading", true);
    this.$store.commit("setToast", this.$ons.notification.toast);
    gapi.load("client:auth2", function () {
      ////console.log(108)
      gapi.client
        .init({
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(
          function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
            // Handle the initial sign-in state.
            callback(gapi.auth2.getAuthInstance().isSignedIn.get());
          },
          function (error) {
            window.alert(JSON.stringify(error, null, 2));
          }
        );
    });
  },
  data() {
    return {
      loginPushed: false,
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
    async signInStateUpdate(arg) {
      ////console.log("Signed In?", arg)
      this.$store.commit("setLoading", false);

      this.$store.commit("setSignInState", arg);
      if (!this.$store.state.signInState) {
        this.$store.commit("navigator/push", LogIn);
        this.loginPushed = true;
        return;
      } else {
        if (this.loginPushed) {
          this.$store.commit("navigator/pop");
          this.loginPushed = false;
        }
        this.$store.commit(
        "setAccessToken",
        gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
          .access_token
      );
        this.$store.dispatch("checkInstall");
      }
      

      //level 1 folders
      //localStorage.setItem('thisDeviceId','1Qo8TQY19PdDd3GPU3wmAmOcw1WByN3lalKkFMHxTwhvCJ-U1ig')
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
