<template>
  <div>
    <div ref="map" class="map-container"></div>
    <v-slider
      v-model="sliderValue"
      color="primary"
      min="0"
      max="1"
      step="0.01"
      @update:model-value="updateClip"
      @mousedown="cancelMapDrag"
      @mouseup="uncancelMapDrag"
      @touchstart="cancelMapDrag"
      @touchend="uncancelMapDrag"
    ></v-slider>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import L from "leaflet";

interface LayerOptions {
  thumbSize: number;
  padding: number;
}

interface Props {
  leftLayers: L.Layer[];
  rightLayers: L.Layer[];
  options?: LayerOptions;
}

const props = defineProps<Props>();
const map = ref<L.Map | null>(null);
const leftLayer = ref<L.Layer | null>(null);
const rightLayer = ref<L.Layer | null>(null);
const sliderValue = ref<number>(0.5);
const mapWasDragEnabled = ref<boolean>(false);
const mapWasTapEnabled = ref<boolean>(false);

const defaultOptions: LayerOptions = {
  thumbSize: 42,
  padding: 0,
};

const options = { ...defaultOptions, ...props.options };

const initializeMap = () => {
  map.value = L.map(map.value!).setView([51.505, -0.09], 13);

  // Add layers to the map
  if (props.leftLayers.length) {
    props.leftLayers[0].addTo(map.value);
  }
  if (props.rightLayers.length) {
    props.rightLayers[0].addTo(map.value);
  }

  setLayers();
  map.value.on("move", updateClip);
  map.value.on("layeradd layerremove", setLayers);
};

const setLayers = () => {
  if (!map.value) return;
  leftLayer.value =
    props.leftLayers.find((layer) => map.value!.hasLayer(layer)) || null;
  rightLayer.value =
    props.rightLayers.find((layer) => map.value!.hasLayer(layer)) || null;
  updateClip();
};

const updateClip = () => {
  if (!map.value) return;

  console.log("update clip", map, map.value);

  const nw = map.value.containerPointToLayerPoint([0, 0]);
  const se = map.value.containerPointToLayerPoint(map.value.getSize());
  const clipX = nw.x + getPosition();
  const clipLeft = `rect(${nw.y}px, ${clipX}px, ${se.y}px, ${nw.x}px)`;
  const clipRight = `rect(${nw.y}px, ${se.x}px, ${se.y}px, ${clipX}px)`;

  if (leftLayer.value) {
    (leftLayer.value.getContainer() as HTMLElement).style.clip = clipLeft;
  }
  if (rightLayer.value) {
    (rightLayer.value.getContainer() as HTMLElement).style.clip = clipRight;
  }
  console.log("update clip after", map, map.value);
};

const getPosition = () => {
  const rangeValue = sliderValue.value;
  const offset = (0.5 - rangeValue) * (2 * options.padding + options.thumbSize);
  return map.value!.getSize().x * rangeValue + offset;
};

onMounted(() => {
  initializeMap();
  console.log("slider value", sliderValue);
});


</script>

<style scoped>
.map-container {
  height: 80vh;
}
</style>
