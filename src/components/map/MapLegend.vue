<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel color="primary">
      <v-expansion-panel-title
        expand-icon="mdi-map-legend"
        collapse-icon="mdi-close"
        v-slot="{ expanded }"
      >
        <b>{{ expanded ? "Legend" : " " }}</b>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-card width="200px" variant="flat">
          <v-card-item color="transparent">
            <v-row direction="column" noGutters>
              <v-col v-for="legend in legends" :key="legend.name" cols="12">
                <legend-item :color="legend.color" :legendName="legend.name" />
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import LegendItem from "./LegendItem.vue";
import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();
const panel = ref([1, 0]);

const legends = [
  { color: "#228B22", name: "Extent" },
  { color: "#9ACD32", name: "Change (Gain)" },
  { color: "#FF7F50", name: "Change (Loss)" },
  { color: "#20B2AA", name: "Restored Area" },
  { color: "#DAA520", name: "Selected Polygon" },
];

watch(
  smAndDown,
  () => {
    if (smAndDown.value) {
      panel.value = [];
    } else {
      panel.value = [1, 0];
    }
  },
  { immediate: true }
);
</script>

<style scoped></style>
