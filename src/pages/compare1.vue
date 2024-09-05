<template>
  <div id="map-container" style="height: 500px;top: 40px;">
    <l-map ref="map" style="height: 100%; width: 100%;" :zoom="zoom" :center="center" :useGlobalLeaflet="true" @ready="onMayReady">
      <!-- Add other map layers and components here -->
       <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <compare-compare
        :left-layers="leftLayers"
        :right-layers="rightLayers"
        :options="controlOptions"
        :compare="true"
        :map="map"
      />
    </l-map>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import CompareCompare from '../components/map/CompareCompare.vue'; // Adjust import path

const mapInstance = ref<L.Map | null>(null);
const leftLayers = ref<L.Layer[]>([]);
const rightLayers = ref<L.Layer[]>([]);
const controlOptions = ref({ thumbSize: 42, padding: 0 });
const map = ref();

const zoom = 13;
const center = [51.505, -0.09];

// Base layers
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
const carto = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; CartoDB",
        "layer-type": "base",
      }
    );

// Square GeoJSON data
const squareGeoJson = {
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-0.09, 51.505],
        [-0.09, 51.51],
        [-0.085, 51.51],
        [-0.085, 51.505],
        [-0.09, 51.505]
      ]
    ]
  },
  "properties": {
    "name": "Square"
  }
};
const squareGeoJsonRight = {
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-0.09, 51.505],
        [-0.09, 52.51],
        [-0.085, 51.51],
        [-0.085, 51.505],
        [-0.09, 52.505]
      ]
    ]
  },
  "properties": {
    "name": "Square"
  }
};

// Creating GeoJSON layers
const geoJsonLayerLeft = L.geoJSON(squareGeoJson, {
  style: {
    color: "#ff0000", // Red color for the left square
    weight: 4
  },
  pane:'left'
});
const geoJsonLayerRight = L.geoJSON(squareGeoJsonRight, {
  style: {
    color: "#0000ff", // Blue color for the right square
    weight: 1
  },
  pane:'right'
});

// Adding layers to left and right arrays
leftLayers.value.push(geoJsonLayerLeft);
rightLayers.value.push(geoJsonLayerRight);

const onMapReady = ()=>{
  map.value.leafletObject.createPane("left");
  map.value.leafletObject.createPane("right");
}


</script>
