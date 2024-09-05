<template>
  <SideBySide
    :leftLayers="[leftTileLayer, leftGeoJsonLayer]"
    :rightLayers="[rightTileLayer, rightGeoJsonLayer]"
    :options="{ thumbSize: 42, padding: 10 }"
  />
</template>

<script>
import L from 'leaflet';
import SideBySide from "~/components/map/SidebySide.vue";

export default {
  components: {
    SideBySide,
  },
  data() {
    return {
      // Define the base tile layers
      leftTileLayer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      rightTileLayer: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'),

      // Define the GeoJSON layers
      leftGeoJsonLayer: L.geoJSON({
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-0.09, 51.505],
            [-0.09, 51.51],
            [-0.1, 51.51],
            [-0.1, 51.505],
            [-0.09, 51.505]
          ]]
        },
        "properties": {
          "name": "Left Layer Area"
        }
      }, {
        style: { color: "red" }
      }),

      rightGeoJsonLayer: L.geoJSON({
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-0.08, 51.505],
            [-0.08, 51.51],
            [-0.07, 51.51],
            [-0.07, 51.505],
            [-0.08, 51.505]
          ]]
        },
        "properties": {
          "name": "Right Layer Area"
        }
      }, {
        style: { color: "blue" }
      })
    };
  }
};
</script>
