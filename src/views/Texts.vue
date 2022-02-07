<template>
  <v-ons-page>
    <div id="text_view">
      <img src="../assets/svg/kitty.svg" class="image" v-if="!$store.state.textList.length"/>
      <h1 style="text-align: center" v-if="!$store.state.textList.length">
        No texts yet...
      </h1>
      <template v-for="text in $store.state.textList">
        <text-list-member :file="text" :key="text.name" />
      </template>
    </div>
  </v-ons-page>
</template>

<script>
import TextListMember from "../components/TextListMember.vue";
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {},
  components: {
    TextListMember,
  },
};
</script>

<style>
.image{
  width: 85vw;
}
</style>
