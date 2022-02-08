<template>
  <v-ons-page>
    <div id="file_view" v-show="$store.state.hasLoaded">
      <img
        src="../assets/svg/kitty.svg"
        class="image"
        v-if="!$store.state.filesList.length"
      />
      <h1 style="text-align: center" v-if="!$store.state.filesList.length">
        No files yet...
      </h1>
      <template v-for="file in $store.state.filesList">
        <file-list-member :file="file" :key="file.name" />
      </template>
    </div>
  </v-ons-page>
</template>

<script>
import FileListMember from "../components/FilesListMember.vue";
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {},
  components: {
    FileListMember,
  },
};
</script>

<style>
.image {
  width: 90vw;
}
</style>
