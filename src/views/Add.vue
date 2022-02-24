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
        <v-ons-toolbar-button @click="upload">
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
          id="text_inp"
        ></textarea>
      </div>
    </v-ons-card>
    <v-ons-card>
      <div class="title">
        files
        <div class="file_add" :style="{ color: icon_clr }">
          <v-ons-icon icon="ion-ios-add" @click="fileSelect" />
        </div>
      </div>
      <div class="content">
        <span v-if="!fileInp.length" style="font-size: small; opacity: 0.5"
          >no files added...
        </span>
        <template v-for="file in fileInp">
          <add-file-member
            :key="file.name"
            :name="file.name"
            :type="file.type"
            :size="file.size"
            @remove="handleRemove(file)"
          />
        </template>
      </div>
    </v-ons-card>
    <input
      type="file"
      style="display: none"
      ref="file"
      id="file"
      @change="fileChange"
      multiple
    />
  </v-ons-page>
</template>

<script>
import AddFileMember from "../components/AddFileMember.vue";
export default {
  data() {
    return {
      text: "",
      icon_clr: "#0b7bff",
      fileInp: [],
      edit: false,
    };
  },
  mounted() {
    if (localStorage.getItem("dark") === "true") this.icon_clr = "#ffa101";
    else this.icon_clr = "#0b7bff";
    if (this.$store.state.preAddText != "") {
      this.text = this.$store.state.preAddText;
      this.$store.commit("setPreAddText", "");
    }
    if (this.$store.state.editFile != null) {
      this.edit = true;
    }
    if (this.$store.state.isShare) {
      caches.open("add").then((cache) => {
        cache.keys().then((requests) => {
          requests.forEach(async (request) => {
            //console.log(response.url);
            //this.cache_items.push(member.url);
            var response = await cache.match(request);
            //console.log(response.url);
            if (response.headers.get("content-type") == "text/plain") {
              response.text().then((txt) => (this.text = txt));
              cache.delete(request);
            } else {
              this.fileInp.push({
                category: "cache",
                content: response,
                name: request.url.slice(26),
                size: response.headers.get("content-length"),
                type: response.headers.get("content-type"),
              });
              cache.delete(request);
            }
          });
        });
      });
    }
    document.getElementById("text_inp").focus()
    this.$store.dispatch("refresh");
    this.$store.commit("setHasLoaded", true)
  },
  computed: {},
  methods: {
    fileChange() {
      for (var i = 0; i < this.$refs.file.files.length; i++) {
        var file = this.$refs.file.files[i];
        this.fileInp.push({
          category: "file",
          content: file,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    },
    fileSelect() {
      document.getElementById("file").click();
    },
    handleRemove(file) {
      console.log(108);
      console.log(file);
      this.fileInp.splice(this.fileInp.indexOf(file), 1);
    },
    async upload() {
      if (!this.text && !this.fileInp.length) {
        this.$ons.notification.toast("Nothing to upload", {
          buttonLabel: "ok!",
          timeout: 2000,
        });
        return;
      }

      if (this.edit) {
        this.$store.dispatch("deleteText", {
          file: this.$store.state.editFile,
          toast: false,
        });
        this.$store.commit("setEditFile", null);
      }

      this.$store.commit("setUploadText", this.text);
      this.$store.commit("setUploadFiles", this.fileInp);
      this.$store.dispatch("uploadContent");
      this.$store.commit("navigator/pop");

      if (this.$store.state.isShare) {
        this.$store.dispatch("refresh");
        this.$store.dispatch("syncSettings");
        this.$store.dispatch("housekeep");
        this.$store.commit("setIsShare", false);
      }
    },
  },
  components: {
    AddFileMember,
  },
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
.file_add {
  position: absolute;
  top: -8px;
  right: 0;
  font-size: larger;
  color: #0b7bff;
}
</style>
