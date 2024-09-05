<template>
  <v-card class="pa-0" width="300" variant="tonal">
    <v-card-title
      class="text-white d-flex align-center"
      :style="`background-color: ${colors[props.type]}`"
    >
    {{ props.title }}
     
    </v-card-title>
    <v-list lines="one">
      <v-list-item
        prepend-icon="mdi-map-marker-outline"
        title="Region"
        :subtitle="`${props.properties?.reg_name} (Region ${props.properties?.reg_num})`"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-calendar-range"
        title="Year"
        :subtitle="props.properties?.year"
      />
      <v-list-item
        prepend-icon="mdi-image-area"
        title="Area"
        :subtitle="`${props.properties?.area} ha`"
      ></v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  type: string;
  title: string;
  properties: object;
}>();

const colors = {
  extent: "#228B22",
  impact: "#20B2AA",
  Gain: "#9ACD32",
  Loss: "#FF7F50",
  region: "#DAA520",
};


</script>

<style scoped lang="scss">



</style>
