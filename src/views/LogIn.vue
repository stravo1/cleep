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
import { gapi } from "gapi-script";
export default {
  methods: {
    sIN() {
      gapi.auth2.getAuthInstance().signIn();
    },
  },
};
</script>
