<template>
    <v-app-bar flat density="comfortable" elevation="0" bg-surface-variant >
        
        <v-container>
  <v-row>
    <v-col class="d-flex justify-start align-center">
      <v-sheet class="ma-1">
        <v-img src="/logos/usaid.jpg"  :width="smAndDown?60:120"/>
      </v-sheet>
      <v-sheet class="ma-1">
        <v-img src="/logos/nasa.jpg"  :width="smAndDown?30:60"/>

      </v-sheet>
    </v-col>
    <v-col class="d-flex justify-end align-center">
      <v-sheet class="ma-1">
        <v-img src="/logos/servir-amz.png"  :width="smAndDown?65:130"/>
      </v-sheet>
      <v-sheet class="ma-1">
        <v-img src="/logos/narei.webp"  :width="smAndDown?20:40"/>
      </v-sheet>
      <v-sheet class="ma-1">
        <v-img src="/logos/ag-ministry.png"  :width="smAndDown?20:40"/>
      </v-sheet>
    </v-col>
  </v-row>
</v-container>
        
    </v-app-bar>
</template>

<script setup lang="ts">

import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();

</script>

<style lang="scss" scoped>

</style>