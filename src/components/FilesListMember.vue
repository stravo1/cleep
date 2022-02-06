<template>
  <div>
    <v-ons-card :class="{ fade_content: dlt }">
      <div class="content">
        <div class="icon color_fade" @click="actionSheetVisible = true">
          <v-ons-icon style="font-size: 42px" :icon="icon" />
        </div>
        <div class="name" @click="actionSheetVisible = true">
          {{ file.name }}
        </div>
        <div class="details" @click="actionSheetVisible = true">
          {{ (parseInt(file.size) / 1000000).toFixed(2) }} mb •
          {{ $store.getters.timeFormatter(file.createdTime) }}
        </div>
        <div
          @click="$store.dispatch('download', file)"
          class="dl_icon color_fade"
        >
          <v-ons-icon style="font-size: smaller" icon="fa-download" />
        </div>
      </div>
    </v-ons-card>

    <v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable>
      <v-ons-action-sheet-button @click="handleDl"
        >download</v-ons-action-sheet-button
      >
      <v-ons-action-sheet-button @click="share"
        >share</v-ons-action-sheet-button
      >
      <v-ons-action-sheet-button
        modifier="destructive"
        style="font-weight: bold"
        @click="hideNdelete"
        >delete</v-ons-action-sheet-button
      >
      <v-ons-action-sheet-button @click="actionSheetVisible = false"
        >cancel</v-ons-action-sheet-button
      >
    </v-ons-action-sheet>
    <v-ons-alert-dialog
      title="Warning!"
      modifier="footer"
      :visible.sync="alertVisible"
    >
      This can not be undone!
      <template slot="footer">
        <v-ons-alert-dialog-button @click="alertVisible = false"
          >Cancel</v-ons-alert-dialog-button
        >
        <v-ons-alert-dialog-button @click="handleDelete"
          >Ok</v-ons-alert-dialog-button
        >
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
async function share(blob, type, name) {
  console.log(blob, type, name);
  var file = new File([blob], name, { type: type });
  var filesArray = [file];
  var shareData = {
    title: name,
    files: filesArray,
    text: "Shared via cleep: " + name,
  };
  return shareData;
}
export default {
  data() {
    return {
      loading: false,
      alertVisible: false,
      dlt: false,
      actionSheetVisible: false,
    };
  },
  methods: {
    hideNdelete() {
      this.alertVisible = true;
      this.actionSheetVisible = false;
    },
    handleDelete() {
      this.alertVisible = false;
      this.dlt = true;
      this.$store.dispatch("deleteFile", this.file);
    },
    handleDl() {
      this.$store.dispatch("download", this.file);
      this.actionSheetVisible = false;
    },
    async share() {
      this.actionSheetVisible = false;
      var result;
      try {
        var blob = await this.$store.dispatch("getContent", this.file);
        var shareData = await share(blob, this.file.mimeType, this.file.name);
        await navigator.share(shareData);
        result = "MDN shared successfully";
      } catch (err) {
        result = "Error: " + err;
        console.log(result);
      }
    },
  },
  computed: {
    icon() {
      if (this.file.mimeType.match(new RegExp("audio/*")))
        return "ion-ios-musical-notes";
      else if (this.file.mimeType.match(new RegExp("video/*")))
        return "ion-ios-videocam";
      else if (this.file.mimeType.match(new RegExp("image/*")))
        return "ion-ios-image";
      else return "ion-ios-document";
    },
  },
  props: ["file"],
};
</script>

<style>
.content {
  position: relative;
}
.icon {
  position: relative;
}
.dl_icon {
  position: absolute;
  top: 10px;
  right: 0;
}
.name {
  position: absolute;
  top: 0px;
  left: 50px;
  font-size: 16px;
  max-width: 60vw;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.details {
  position: absolute;
  top: 26px;
  left: 50px;
  font-size: smaller;
  opacity: 0.5;
}
.color_fade {
  color: rgb(136, 136, 136);
}
.fade_content {
  opacity: 0.25;
}
</style>
