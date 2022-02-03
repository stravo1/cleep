<template>
  <div>
    <v-ons-card @click="actionSheetVisible = true" id="123">
      <div class="title">
        <span :class="{ txt_fadetxt: loading }">
          3 mintues ago
        </span>
      </div>
      <div class="content">
        <span
          :class="{ txt_fadetxt: loading }"
          v-html="checkForLink(text)"
        ></span>
      </div>
    </v-ons-card>

    <v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable>
      <v-ons-action-sheet-button>copy</v-ons-action-sheet-button>
      <v-ons-action-sheet-button>edit</v-ons-action-sheet-button>
      <v-ons-action-sheet-button
        modifier="destructive"
        style="font-weight: bold"
        @click="setLoading"
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

export default {
  data() {
    return {
      actionSheetVisible: false,
      loading: false,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis nisl sed ante facilisis, google.com Fusce vel tincidunt felis. Aenean malesuada tristique est, quis facilisis nisl fermentum sed. Nam vel ipsum gravida sem varius mattis id vitae nulla. Class aptent taciti sociosqu ad litora torquent per conubia.",
    };
  },
  methods: {
    setLoading() {
      setTimeout(() => {
        this.loading = true;
      }, 2000);
      setTimeout(() => {
        this.loading = false;
      }, 5500);
      this.actionSheetVisible = false;
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
  mounted() {
    var dg = this.$ons.GestureDetector(document.getElementById("123"));
    dg.on("hold", function (event) {
      alert("longpress");
    });
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
</style>
