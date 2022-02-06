<template>
        <v-ons-card style="margin: 1rem 0 0 0">
            <div class="content">
        <div class="icon color_fade">
          <v-ons-icon style="font-size: 42px" :icon="icon" />
        </div>
        <div class="name">{{ name }}</div>
        <div class="details">{{ (parseInt(size)/(1000000)).toFixed(2) }} mb</div>
        <div class="dl_icon color_fade">
          <v-ons-icon icon="ion-ios-close" @click="$emit('remove')"/>
        </div>
      </div>
        </v-ons-card>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  methods:{

  },
  computed:{
    icon(){
      if(this.type.match(new RegExp('audio/*'))) return "ion-ios-musical-notes"
      else if (this.type.match(new RegExp('video/*'))) return "ion-ios-videocam" 
      else if (this.type.match(new RegExp('image/*'))) return "ion-ios-image"
      else return "ion-ios-document" 
    }
  },
  props:['type', "name", "size"]
}
</script>
<style>
.content {
  position: relative;
}
.icon {
  position: relative;
}
.dl_icon {
  position: absolute;
  top: 4px;
  right: 0;
  font-size: 24px;
}
.name {
  position: absolute;
  top: 0px;
  left: 50px;
  font-size: 16px;
  max-width: 60vw;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.details {
  position: absolute;
  top: 26px;
  left: 50px;
  font-size: smaller;
  opacity: 0.5;
  text-align: end;
}
.color_fade{
    color: rgb(136, 136, 136);
}
</style>