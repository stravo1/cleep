<template>
  <div>
    <v-ons-card @click="actionSheetVisible = true" id="123">
      <div class="content">
        <template v-if="loaded"
          ><span
            :class="{ txt_fadetxt: dlt }"
            v-html="checkForLink(text)"
          ></span>
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
      <v-ons-action-sheet-button>copy</v-ons-action-sheet-button>
      <v-ons-action-sheet-button>edit</v-ons-action-sheet-button>
      <v-ons-action-sheet-button
        modifier="destructive"
        style="font-weight: bold"
        @click="dlt_text"
        >delete</v-ons-action-sheet-button
      >
      <v-ons-action-sheet-button @click="actionSheetVisible = false"
        >cancel</v-ons-action-sheet-button
      >
    </v-ons-action-sheet>
  </div>
</template>

<script>
import linkifyHTMl from "linkifyjs/html";
import DOMpurfiy from "dompurify";
import { Skeleton } from "vue-loading-skeleton";

export default {
  data() {
    return {
      actionSheetVisible: false,
      loaded: false,
      dlt: false,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis nisl sed ante facilisis, google.com Fusce vel tincidunt felis. Aenean malesuada tristique est, quis facilisis nisl fermentum sed. Nam vel ipsum gravida sem varius mattis id vitae nulla. Class aptent taciti sociosqu ad litora torquent per conubia.",
    };
  },
  methods: {
    dlt_text() {
      this.actionSheetVisible = false;
      this.dlt = true;
      this.$store.dispatch("deleteText", this.file);
    },
    checkForLink(arg) {
      var x = DOMpurfiy.sanitize(
        linkifyHTMl(arg, {
          target: "_blank",
        })
      );
      return x;
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
<style>
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
