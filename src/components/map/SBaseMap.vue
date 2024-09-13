<template>
     <v-expansion-panels v-model="panel">
    <v-expansion-panel color="primary">
      <v-expansion-panel-title
        expand-icon="mdi-map"
        collapse-icon="mdi-close"
        v-slot="{ expanded }"
        density=""
      >
        <b>{{ expanded ? "BaseMap" : " " }}</b>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-card class="mx-auto" :width="smAndDown?'300px':'700px'" variant="flat">
         <base-layers :lmap="lmap"/>
        </v-card>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
   </template>
   
   <script setup lang="ts">
   import BaseLayers from './BaseLayers.vue';

   import { useDisplay } from "vuetify";
   const { smAndDown } = useDisplay();
   
   const props = defineProps<{
     lmap: any; 
   }>();
   const panel = ref(null);
   
   
   </script>
   
   <style scoped></style>
   