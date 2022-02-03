<template>
        <v-ons-card style="margin: 1rem 0 0 0">
            <div class="content">
        <div class="icon color_fade">
          <v-ons-icon style="font-size: 42px" icon="ion-ios-image" />
        </div>
        <div class="name">file name</div>
        <div class="details">2.85 mb</div>
        <div class="dl_icon color_fade">
          <v-ons-icon icon="ion-ios-close" />
        </div>
      </div>
        </v-ons-card>
</template>
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