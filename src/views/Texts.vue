<template>
  <v-ons-page>
    <div id="text_view">
      <template v-for="text in $store.state.textList" >
        <text-list-member :file="text" :key="text.name" />
      </template>
    </div>
  </v-ons-page>
</template>

<script>
import TextListMember from "../components/TextListMember.vue"
export default {
  data(){
      return{

      }
  },
  methods:{

  },
  computed:{

  },
  components:{
      TextListMember
  }
};
</script>
