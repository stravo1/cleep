<template>
  <div>
    <v-ons-card id="123">
      <div class="content">
        <div class="icon color_fade" @click="actionSheetVisible = true">
          <v-ons-icon style="font-size: 42px" icon="ion-ios-image" />
        </div>
        <div class="name" @click="actionSheetVisible = true">file name</div>
        <div class="details" @click="actionSheetVisible = true">2.85 mb - 3 minutes ago</div>
        <div class="dl_icon color_fade">
          <v-ons-icon style="font-size: smaller;" icon="fa-download" />
        </div>
      </div>
    </v-ons-card>

    <v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable>
      <v-ons-action-sheet-button>download</v-ons-action-sheet-button>
      <v-ons-action-sheet-button>share</v-ons-action-sheet-button>
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
export default {
  data() {
    return {
      loading: false,
      actionSheetVisible: false,
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
  },
};
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
  top: 10px;
  right: 0;
  
}
.name {
  position: absolute;
  top: 0px;
  left: 50px;
  font-size: 18px;
}
.details {
  position: absolute;
  top: 26px;
  left: 50px;
  font-size: smaller;
  opacity: 0.75;
}
.color_fade{
    color: rgb(90, 90, 90);
}
</style>
