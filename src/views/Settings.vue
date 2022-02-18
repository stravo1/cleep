<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <slot name="left">
          <v-ons-back-button @click="handleBackClick" />
        </slot>
      </div>
      <div class="center">
        <slot>Settings</slot>
      </div>
      <div class="right"><slot name="right"></slot></div>
    </v-ons-toolbar>
    <v-ons-list>
      <v-ons-list-header>Misc</v-ons-list-header>
      <v-ons-list-item>
        <label class="center" for="switch1"> Dark theme </label>
        <div class="right">
          <v-ons-switch
            input-id="switch1"
            v-model="dTheme"
            @change="handleThemeChange"
          >
          </v-ons-switch>
        </div>
      </v-ons-list-item>
      <v-ons-list-item @click="sOUT">
        <div class="left">Sign Out</div>
        <div class="right">
          <v-ons-icon icon="ion-ios-power" />
        </div>
      </v-ons-list-item>

      <v-ons-list-header>Housekeeping</v-ons-list-header>
      <v-ons-list-item>
        Refresh texts and files list:
        <v-ons-row>
          <v-ons-col width="40px" style="text-align: center; line-height: 31px">
            <v-ons-icon icon="md-minus"></v-ons-icon>
          </v-ons-col>
          <v-ons-col>
            <v-ons-range
              v-model="rTime"
              step="25"
              style="width: 100%"
              @change="handleRefreshChange"
            ></v-ons-range>
          </v-ons-col>
          <v-ons-col width="40px" style="text-align: center; line-height: 31px">
            <v-ons-icon icon="md-plus"></v-ons-icon>
          </v-ons-col>
        </v-ons-row>
        {{
          [
            "every 5 seconds",
            "every 15 seconds",
            "every 30 seconds",
            "every 1 minute",
            "manually",
          ][[0, 25, 50, 75, 100].indexOf(parseInt(rTime))]
        }}
      </v-ons-list-item>
      <v-ons-list-item>
        Delete old texts after:
        <v-ons-row>
          <v-ons-col width="40px" style="text-align: center; line-height: 31px">
            <v-ons-icon icon="md-minus"></v-ons-icon>
          </v-ons-col>
          <v-ons-col>
            <v-ons-range
              v-model="textLimit"
              step="25"
              style="width: 100%"
            ></v-ons-range>
          </v-ons-col>
          <v-ons-col width="40px" style="text-align: center; line-height: 31px">
            <v-ons-icon icon="md-plus"></v-ons-icon>
          </v-ons-col>
        </v-ons-row>
        {{
          ["10 texts", "20 texts", "50 texts", "100 texts", "never"][
            [0, 25, 50, 75, 100].indexOf(parseInt(textLimit))
          ]
        }}
      </v-ons-list-item>
      <v-ons-list-item>
        Delete old files after:
        <v-ons-row>
          <v-ons-col width="40px" style="text-align: center; line-height: 31px">
            <v-ons-icon icon="md-minus"></v-ons-icon>
          </v-ons-col>
          <v-ons-col>
            <v-ons-range
              v-model="fileLimit"
              step="25"
              style="width: 100%"
            ></v-ons-range>
          </v-ons-col>
          <v-ons-col width="40px" style="text-align: center; line-height: 31px">
            <v-ons-icon icon="md-plus"></v-ons-icon>
          </v-ons-col>
        </v-ons-row>
        {{
          ["10 files", "20 files", "30 files", "50 files", "never"][
            [0, 25, 50, 75, 100].indexOf(parseInt(fileLimit))
          ]
        }}
      </v-ons-list-item>
      <v-ons-list-header>Information</v-ons-list-header>
      <v-ons-list-item modifier="nodivider">
        <div class="left">About</div>
        <div class="right">
          <v-ons-icon icon="ion-ios-link" />
        </div>
      </v-ons-list-item>
      <v-ons-list-item modifier="nodivider">
        <div class="left">Guide</div>
        <div class="right">
          <v-ons-icon icon="ion-ios-link" />
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import { gapi } from "gapi-script";
export default {
  data() {
    return {
      name: "",
      dTheme: true,
    };
  },
  mounted() {
    this.$store.dispatch("syncSettings");
    if (localStorage.getItem("dark") === null) this.dTheme = false;
    else if (localStorage.getItem("dark") === "true") this.dTheme = true;
    else this.dTheme = false;

    this.rTime = [0, 25, 50, 75, 100][
      [5, 15, 30, 60, 60 * 30].indexOf(parseInt(this.$store.state.refreshTime))
    ];
  },
  methods: {
    handleThemeChange() {
      this.$ons.notification.alert("Reload to apply changes");
      localStorage.setItem("dark", JSON.stringify(!this.dTheme));
    },
    handleRefreshChange() {
      var time = [5, 15, 30, 60, 60 * 30][
        [0, 25, 50, 75, 100].indexOf(parseInt(this.rTime))
      ];
      this.$store.commit("setRefreshTime", time);
      localStorage.setItem("time", JSON.stringify(time));
    },
    sOUT() {
      gapi.auth2.getAuthInstance().signOut();
    },

    handleBackClick() {
      var json = {
        rTime: this.rTime,
        txtLmt: this.textLimit,
        fileLmt: this.fileLimit,
      };
      var settingsBlob = new Blob([JSON.stringify(json)], {
        type: "application/json",
      });

      this.$store.dispatch("uploadSettings", settingsBlob);
      this.$store.commit("navigator/pop");
    },
  },
  computed: {
    fileLimit: {
      get() {
        return this.$store.state.settings.fileLmt;
      },
      set(value) {
        this.$store.commit("setFileLmt", parseInt(value));
      },
    },
    textLimit: {
      get() {
        return this.$store.state.settings.txtLmt;
      },
      set(value) {
        this.$store.commit("setTxtLmt", parseInt(value));
      },
    },
    rTime: {
      get() {
        return this.$store.state.settings.rTime;
      },
      set(value) {
        this.$store.commit("setRTime", parseInt(value));
      },
    },
  },
};
</script>
