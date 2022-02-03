<template>
  <v-ons-tabbar @postchange="handleChange" swipeable modifier="ios" :index.sync="index" :tabs="tabs"></v-ons-tabbar>
</template>

<script>
import Files from "../views/Files.vue";
import Texts from "../views/Texts.vue";
export default {
  data() {
    return {
      tabs: [
        {
          label: "texts",
          icon: "ion-ios-text",
          page: Texts,
          
        },
        {
          label: "files",
          icon: "ion-ios-images",
          page: Files,
        },
      ],
    };
  },
  methods:{
      handleChange(e){
         
          if(e.index == 0) console.log("Texts mounted")
          if(e.index == 1) console.log("Files mounted")
      }
  },
  computed: {
    index: {
      get() {
        return this.$store.state.tabbar.index;
      },
      set(newValue) {
        this.$store.commit("tabbar/set", newValue);
      },
    },
  },
};
</script>
