<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center" style="font-weight: bold; font-size: larger">
        cleep
      </div>
      <div class="left">
        <v-ons-toolbar-button
          icon="ion-ios-add"
          @click="push('add')"
        ></v-ons-toolbar-button>
      </div>
      <div class="right">
        <v-ons-toolbar-button
          icon="ion-ios-cog"
          @click="push('settings')"
        ></v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <br />

    <Tabs />

    <v-ons-modal :visible="$store.state.isLoading">
      <p style="text-align: center">
        <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
        {{ $store.state.loadingMessage }}
      </p>
    </v-ons-modal>
  </v-ons-page>
</template>

<script>
// @ is an alias to /src
import Tabs from "../components/Tabs.vue";
import Settings from "./Settings.vue";
import Add from "./Add.vue";

export default {
  name: "Home",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    push(page) {
      if (page === "add") this.$store.commit("navigator/push", Add);
      if (page === "settings") this.$store.commit("navigator/push", Settings);
    },
  },
  components: { Tabs, Add, Settings },
};
</script>
