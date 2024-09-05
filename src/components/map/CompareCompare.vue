<template>
  <div></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import L from "leaflet";
import "~/utils/LControlSideBySide"; // Adjust the import path to your JS file

interface Options {
  thumbSize?: number;
  padding?: number;
}

const props = defineProps<{
  leftLayers: L.Layer[];
  rightLayers: L.Layer[];
  options?: Options;
  map: L.Map;
  compare: boolean;
}>();

const dividerPosition = ref<number>(0.5);
let control = ref<L.Control | null>(null); // Define control variable outside of the function to maintain its reference

const initSideBySide = () => {
  if (!props.map.leafletObject) {
    console.error("Map is not defined.");
    return;
  }

  // Create panes for side-by-side layers
  props.map.leafletObject.createPane("left");
  props.map.leafletObject.createPane("right");

  // Add layers to their respective panes
  props.leftLayers.forEach((layer) => {
    layer.options.pane = "left";
    layer.addTo(props.map.leafletObject);
  });
  props.rightLayers.forEach((layer) => {
    layer.options.pane = "right";
    layer.addTo(props.map.leafletObject);
  });

  // Initialize side-by-side control
  control.value = L.control.splitMap(
    props.leftLayers,
    props.rightLayers,
    props.options
  );
  control.value.addTo(props.map.leafletObject);
};

const removeSideBySide = () => {
  if (control.value && props.map.leafletObject) {
    // Remove existing control and layers
    console.log("removing control")
    props.map.leafletObject.removeControl(control.value);
    console.log("removed control")
    props.leftLayers.forEach((layer) =>
      props.map.leafletObject.removeLayer(layer)
    );
    props.rightLayers.forEach((layer) =>
      props.map.leafletObject.removeLayer(layer)
    );
    control.value = null;
  }
};

// Combined watch for changes in 'compare', 'leftLayers', and 'rightLayers' props
watch(
  () => [props.compare, props.leftLayers, props.rightLayers],
  (
    [compare, leftLayers, rightLayers],
    [oldCompare, oldLeftLayers, oldRightLayers] = []
  ) => {
    console.log("control",props.leftLayers,props.rightLayers,props.compare)

    // Only proceed if any of the watched props have changed
    if (
      compare === oldCompare &&
      leftLayers === oldLeftLayers &&
      rightLayers === oldRightLayers
    ) {
      return;
    }
    // Remove the previous control if needed
    if (control.value) removeSideBySide();

    // Initialize the side-by-side control if comparison mode is active
    if (compare) initSideBySide();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "~/assets/css/splitmap.scss"
</style>
