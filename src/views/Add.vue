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
      <div class="right"><slot name="right"></slot></div>
    </v-ons-toolbar>
  </v-ons-page>
</template>
