<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">
        <b>Welcome!</b>
      </div>
    </v-ons-toolbar>
    <v-ons-card>
      <div class="title">Log In to continue :)</div>
      <div class="content">
        <p>
          This app needs access to your Google Drive storage to enable
          synchronisation. If you are looking for something similar but do not
          want the sync feature, you might want to check out the
          <a href="https://scrapbook-pwa.web.app/">Scrapbook PWA.</a>
        </p>
        <p>
          Don't worry, cleep CAN NOT access your personal files in Google Drive.
          It will create and access files in a separate secluded folder
          invisible to the user (<code
            ><a
              href="https://developers.google.com/identity/protocols/oauth2/scopes#drive"
              >drive.appdata</a
            ></code
          >). So please provide all the necessary permissions whie loggin in.
        </p>
        <br />
        <div style="text-align: center">
          <v-ons-button @click="sIN">Continue with Google</v-ons-button>
        </div>
      </div>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import axios from "axios";

var CLIENT_ID =
  "202885509544-6sit8gj5j4abi5kkrh0ija74182bh3e1.apps.googleusercontent.com";
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
// accesses only the appData folder
var SCOPES = "https://www.googleapis.com/auth/drive.appdata";

const client = (callback) =>
  google.accounts.oauth2.initCodeClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    ux_mode: "popup",
    prompt: "consent",
    callback: callback,
  });
export default {
  methods: {
    async sIN() {
      client(async (response) => {
        var code = response.code;
        var tokens = await axios.post("https://red-formula-303406.ue.r.appspot.com/auth/cleep", {
          code,
        });
        localStorage.setItem("refreshToken", tokens.data.refresh_token);
        this.$store.commit("setSignInState", true);
      }).requestCode();
    },
  },
};
</script>
