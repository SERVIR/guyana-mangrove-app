<template>
  <div class="ma-5">
    <v-expansion-panels v-model="panel">
      <v-expansion-panel color="primary">
        <v-expansion-panel-title
          expand-icon="mdi-cog"
          collapse-icon="mdi-close"
          v-slot="{ expanded }"
        >
          <b>{{ expanded ? "Map Control" : " " }}</b>
        </v-expansion-panel-title>
        <v-expansion-panel-text >
          <v-card :width="smAndDown ? '280px' : '400px'" variant="flat" max-height="80vh" class="overflow-auto">
            <v-tabs color="primary" density="compact" grow v-model="tab">
              <v-tab
                prepend-icon="mdi-filter"
                text="Parameters"
                value="parameters"
              />
              <v-tab prepend-icon="mdi-layers" text="Layers" value="layers" />
            </v-tabs>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="parameters">
                <div class="ma-5">
                  <v-select
                    label="Primary Year"
                    :items="years"
                    v-model="yearSelected"
                    variant="underlined"
                  />
                  <v-select
                    v-if="!props.rightControl"
                    label="Region"
                    :items="regions"
                    v-model="regionSelected"
                    variant="underlined"
                  />
                  <v-checkbox
                    v-if="!props.rightControl"
                    class=""
                    v-model="compare"
                    color="primary"
                    label="Compare"
                    density="comfortable"
                    hide-details
                  ></v-checkbox>
                </div>
              </v-tabs-window-item>

              <v-tabs-window-item value="layers">
                <v-card class="ma-7" variant="flat">
                  <v-list>
                    <v-list-item class="">
                      <v-checkbox
                        density="compact"
                        class="custom-checkbox"
                        v-model="selectedLayer"
                        label="Extent"
                        key="extent"
                        value="extent"
                      />
                      <v-checkbox
                        density="compact"
                        class="custom-checkbox"
                        v-model="selectedLayer"
                        label="Change"
                        value="change"
                        key="change"
                      />
                      <v-checkbox
                        density="compact"
                        class="custom-checkbox"
                        v-model="selectedLayer"
                        label="Restoration Impacts"
                        value="impact"
                        key="impact"
                      />
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from "vue";
import BaseLayers from "./BaseLayers.vue";

import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();

const props = withDefaults(
  defineProps<{
    lmap: any;
    rightControl: boolean;
  }>(),
  {
    rightControl: false,
  }
);

// Reactive state
const panel = ref([1, 0]);
const tab = ref("parameters");
const years = ref([2020, 2015, 2010]);
const compare = ref(false);
const regions = ref([
  {
    title: "None",
    value: null,
  },
  {
    title: "Region 1",
    value: 1,
  },
  {
    title: "Region 2",
    value: 2,
  },
  {
    title: "Region 3",
    value: 3,
  },
  {
    title: "Region 4",
    value: 4,
  },
  {
    title: "Region 5",
    value: 5,
  },
  {
    title: "Region 6",
    value: 6,
  },
]);
const selectedLayer = ref<string[]>(["extent", "change", "impact"]);
const yearSelected = ref(2020);
const regionSelected = ref<string | undefined>(undefined);

// Event emitter
const emit = defineEmits([
  "update",
  "updateLayers",
  "updateRegion",
  "updateComparison",
]);

// Watches for changes and emit events
watch(
  [yearSelected],
  () => {
    emit("update", { year: yearSelected.value });
  },
  { immediate: true }
);

watch(
  selectedLayer,
  () => {
    emit("updateLayers", { layers: selectedLayer.value });
  },
  { immediate: true }
);

watch(
  regionSelected,
  () => {
    emit("updateRegion", { region: regionSelected.value });
  },
  { immediate: true }
);

watch(
  compare,
  () => {
    emit("updateComparison", { compare: compare.value });
  },
  { immediate: true }
);

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

<style scoped>
.custom-checkbox {
  margin-bottom: -20px !important;
}
</style>
