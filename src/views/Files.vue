<template>
  <v-ons-page>
    <div id="file_view">
      <template v-for="file in $store.state.filesList" >
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
