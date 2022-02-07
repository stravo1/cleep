<template>
  <div>
    <v-ons-card
      :class="{ txt_fadetxt: dlt }"
      @click="actionSheetVisible = true"
      id="123"
    >
      <div class="content">
        <template v-if="loaded"
          ><span v-html="checkForLink(text)"></span>
          <div class="info">
            {{ $store.getters.timeFormatter(file.createdTime) }}
          </div>
        </template>
        <template v-else>
          <Skeleton />
          <Skeleton />
        </template>
      </div>
    </v-ons-card>

    <v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable>
      <v-ons-action-sheet-button @click="copy">copy</v-ons-action-sheet-button>
      <v-ons-action-sheet-button @click="edit">edit</v-ons-action-sheet-button>
      <v-ons-action-sheet-button
        modifier="destructive"
        style="font-weight: bold"
        @click="handleDlt"
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
        <v-ons-alert-dialog-button @click="dlt_text"
          >Ok</v-ons-alert-dialog-button
        >
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
import Add from "../views/Add.vue";
import linkifyHTMl from "linkifyjs/html";
import DOMpurfiy from "dompurify";
import { Skeleton } from "vue-loading-skeleton";

export default {
  data() {
    return {
      actionSheetVisible: false,
      alertVisible: false,
      loaded: false,
      dlt: false,
      text: "",
    };
  },
  methods: {
    copy() {
      this.actionSheetVisible = false;
      navigator.clipboard.writeText(this.text);
    },
    handleDlt() {
      this.alertVisible = true;
      this.actionSheetVisible = false;
    },
    dlt_text() {
      this.alertVisible = false;
      this.dlt = true;
      this.$store.dispatch("deleteText", { file: this.file, toast: true });
    },
    checkForLink(arg) {
      var x = DOMpurfiy.sanitize(
        linkifyHTMl(arg, {
          target: "_blank",
        })
      );
      return x;
    },
    edit() {
      this.actionSheetVisible = false;
      this.$store.commit("setPreAddText", this.text);
      this.$store.commit("setEditFile", this.file);
      this.$store.commit("navigator/push", Add);
      this.$store.commit("setEditFile", this.file);
    },
  },
  async mounted() {
    var content = await this.$store.dispatch("getContent", this.file);
    this.loaded = true;
    content.text().then((text) => (this.text = text));
    var dg = this.$ons.GestureDetector(document.getElementById("123"));
    dg.on("hold", function (event) {
      alert("longpress");
    });
  },
  props: ["file"],
  components: {
    Skeleton,
  },
};
</script>
<style scope>
.txt_card {
  position: relative;
}
.txt_fadetxt {
  opacity: 0.25;
}
.content {
  font-size: 1rem !important;
}
.info {
  font-size: small;
  text-align: end;
  opacity: 0.5;
}
</style>
