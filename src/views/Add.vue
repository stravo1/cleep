<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <slot name="left">
          <v-ons-back-button />
        </slot>
      </div>
      <div class="center">
        <slot>Add</slot>
      </div>
      <div class="right">
        <v-ons-toolbar-button>
          <v-ons-icon style="font-size: 42px" icon="ion-ios-checkmark" />
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <v-ons-card>
      <div class="content">
        <textarea
          class="textarea textarea--transparent"
          placeholder="type text here..."
          rows="5"
          v-model="text"
        ></textarea>
      </div>
    </v-ons-card>
    <v-ons-card>
      <div class="title">files
        <div class="file_add" :style="{ color : icon_clr }">
          <v-ons-icon icon="ion-ios-add" />
        </div>
      </div>
      <div class="content">
        <span v-if="false" style="font-size:small; opacity:0.5">no files added... </span>

        <add-file-member />
        <add-file-member />
      </div>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import AddFileMember from "../components/AddFileMember.vue"
export default {
  data() {
    return {
      text: "",
      icon_clr: "#0b7bff"
    };
  },
  mounted(){
      if(localStorage.getItem("dark") === "true") this.icon_clr = "#ffa101"
      else this.icon_clr = "#0b7bff"
  },
  computed: {
    
  },
  components:{
    AddFileMember
  }
};
</script>
<style>
.title {
  position: relative;
}
.textarea {
  max-height: 5rem;
  width: 100% !important;
}
.file_add{
  position: absolute;
  top: -8px;
  right: 0;
  font-size: larger;
  color: #0b7bff
}
</style>
