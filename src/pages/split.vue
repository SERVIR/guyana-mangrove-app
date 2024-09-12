<template>
    <client-only>
      <div>
        <l-map
          ref="lmap"
          style="height: calc(100vh - 112px)"
          :zoom="zoom"
          :center="center"
          :options="{ zoomControl: false }"
          :bounds="bound"
          @ready="onMayReady"
        >
          <l-control position="topleft">
            <map-control
              key="left"
              :lmap="lmap"
              :right-control="false"
              @update="handleUpdate"
              @update-layers="handleLayerUpdate"
              @update-region="handleRegionUpdate"
              @update-comparison="handleComparison"
            />
          </l-control>
          <l-control position="topright">
            <map-control
              key="right"
              v-show="compare"
              :lmap="lmap"
              :right-control="true"
              @update="handleUpdateRight"
              @update-layers="handleLayerUpdateRight"
              @update-region="handleRegionUpdate"
            />
          </l-control>
  
          <l-control position="bottomright">
            <map-legend />
          </l-control>
          <l-control position="bottomright">
            <s-base-map :lmap="lmap" />
          </l-control>
  
          <l-control-zoom :position="compare ? 'bottomleft' : 'topright'" />
  
          <l-tile-layer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            layer-type="base"
            name="CartoDB"
          />
  
          <div>
            <l-geo-json
              ref="geoExtent"
              v-if="displayLayer('extent')"
              :geojson="geojsonExtent"
              :options-style="geoStylerExtent"
              pane="left"
              :options="geoExtentOption"
            />
            <l-geo-json
              ref="geoChange"
              v-if="displayLayer('change')"
              :geojson="geojsonChange"
              :options-style="geoStylerChange"
              pane="left"
              :options="geoChangeOption"
            />
            <l-geo-json
              ref="geoImpact"
              v-if="displayLayer('impact')"
              :geojson="geojsonImpact"
              :options-style="geoStylerImpact"
              pane="left"
              :options="geoImpactOption"
            />
            <l-geo-json
              ref="geoZoom"
              v-if="zoomRegion()"
              :geojson="geojsonExtent"
              :options-style="geoStylerRegion"
              :key="selectedRegion"
              pane="left"
            />
          </div>
          <div>
            <l-geo-json
              ref="geoExtentRight"
              v-if="compare && displayLayerRight('extent')"
              :geojson="geojsonExtentRight"
              :options-style="geoStylerExtent"
              pane="right"
              :options="geoExtentOption"
            />
            <l-geo-json
              ref="geoChangeRight"
              v-if="compare && displayLayerRight('change')"
              :geojson="geojsonChangeRight"
              :options-style="geoStylerChange"
              pane="right"
              :options="geoChangeOption"
            />
            <l-geo-json
              ref="geoImpactRight"
              v-if="compare && displayLayerRight('impact')"
              :geojson="geojsonImpactRight"
              :options-style="geoStylerImpact"
              pane="right"
              :options="geoImpactOption"
            />
            <l-geo-json
              ref="geoZoom"
              v-if="zoomRegion()"
              :geojson="geojsonExtent"
              :options-style="geoStylerRegion"
              :key="selectedRegion"
              pane="right"
            />
          </div>
        </l-map>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="80"
          class="loading-spinner"
        />
      </div>
    </client-only>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, createApp } from "vue";
  import L from "leaflet";
  import { type PointExpression, type StyleFunction, GeoJSON } from "leaflet";
  import { definePageMeta } from "#imports";
  import { useFetchData } from "~/composables/useFetchData";
  import SBaseMap from "~/components/map/SBaseMap.vue";
  import PopupContent from "~/components/PopupContent.vue";
  import * as components from "vuetify/components";
  import * as directives from "vuetify/directives";
  import { createVuetify } from "vuetify";
  
  import SplitMapControl, { splitMap } from "~/utils/MapSplit"; // Adjust the import path to your JS file
  
  definePageMeta({ layout: "custom" });


  interface SplitMapOptions extends L.ControlOptions {
  thumbSize: number;
  padding: number;
}
  
  const vuetify = createVuetify({
    components,
    directives,
  });
  
  const startLoading = ref(false);
  
  const lmap = ref<any>(null);
  const bound = ref<L.LatLngBounds | null>(null);
  const center = ref<PointExpression>([7.5, -59.009974732630165]);
  const zoom = ref(9);
  const geoExtent = ref(null);
  const geoExtentRight = ref(null);
  const geoChange = ref(null);
  const geoChangeRight = ref(null);
  const geoImpact = ref(null);
  const geoImpactRight = ref(null);
  
  const geojsonExtent = ref<any>(undefined);
  const geojsonImpact = ref<any>(undefined);
  const geojsonChange = ref<any>(undefined);
  
  const geojsonExtentRight = ref<any>(undefined);
  const geojsonImpactRight = ref<any>(undefined);
  const geojsonChangeRight = ref<any>(undefined);
  
  const params = ref<any>(undefined);
  const loading = ref(true);
  const selectedLayer = ref<string[]>([]);
  const selectedRegion = ref<string | undefined>(undefined);
  
  const paramsRight = ref<any>(undefined);
  const selectedLayerRight = ref<string[]>([]);
  const selectedRegionRight = ref<string | undefined>(undefined);
  
  const compare = ref(false);
  
  const controlOptions = ref<SplitMapOptions>({ thumbSize: 42, padding: 0 });
  const splitControl = ref<L.Control | null>(null); // Reference for the split control
  
  const { fetchData } = useFetchData();
  
  const leftLayers = ref<L.Layer[]>([]); // Maintain left layers
  const rightLayers = ref<L.Layer[]>([]);
  const colors = {
    extent: "#228B22",
    impact: "#20B2AA",
    gain: "#9ACD32",
    loss: "#FF7F50",
    region: "#DAA520",
    nocolor: "transparent",
  };
  
  const onMayReady = async () => {
    lmap.value.leafletObject.createPane("left");
    lmap.value.leafletObject.createPane("right");
  };
  
  const geoExtentOption = computed(() => {
    return {
      onEachFeature: onEachFeatureExtent,
    };
  });
  
  const onEachFeatureExtent = (feature: any, layer: any) => {
    const popupContainer = document.createElement("div");
  
    const props = {
      type: "extent",
      title: "Extent",
      properties: feature.properties,
    };
    const popupApp = createApp(PopupContent, props).use(vuetify);
    popupApp.mount(popupContainer);
    layer.on({
      mouseover: () => {
        layer.setStyle({ color: colors.region, weight: 1 });
      },
      mouseout: () => {
        layer.setStyle({
          color: colors.extent,
          fillColor: colors.extent,
          opacity: 1,
          fillOpacity: 0.8,
        });
      },
    });
    layer.bindPopup(popupContainer);
  };
  
  const geoChangeOption = computed(() => {
    return {
      onEachFeature: onEachFeatureChange,
    };
  });
  
  const onEachFeatureChange = (feature: any, layer: any) => {
    const popupContainer = document.createElement("div");
    const color = getColor(feature);
  
    const props = {
      type: feature.properties.status,
      title: `Change (${feature.properties.status})`,
      properties: feature.properties,
    };
    const popupApp = createApp(PopupContent, props).use(vuetify);
    popupApp.mount(popupContainer);
    layer.on({
      mouseover: () => {
        layer.setStyle({ color: colors.region, weight: 1 });
      },
      mouseout: () => {
        layer.setStyle({
          color: color,
          fillColor: color,
          opacity: 1,
          fillOpacity: 0.2,
        });
      },
    });
    layer.bindPopup(popupContainer);
  };
  
  const geoImpactOption = computed(() => {
    return {
      onEachFeature: onEachFeatureImpact,
    };
  });
  
  const onEachFeatureImpact = (feature: any, layer: any) => {
    const popupContainer = document.createElement("div");
  
    const props = {
      type: "impact",
      title: "Restoration Impacts",
      properties: feature.properties,
    };
    const popupApp = createApp(PopupContent, props).use(vuetify);
    popupApp.mount(popupContainer);
    layer.on({
      mouseover: () => {
        layer.setStyle({ color: colors.region, weight: 1 });
      },
      mouseout: () => {
        layer.setStyle({
          color: colors.impact,
          fillColor: colors.impact,
          opacity: 1,
          fillOpacity: 0.7,
        });
      },
    });
    layer.bindPopup(popupContainer);
  };
  
  const getColor = (feature: any) => {
    if (feature.properties?.status) {
      switch (feature.properties.status) {
        case "Gain":
          return colors.gain;
        case "Loss":
          return colors.loss;
        default:
          return colors.extent;
      }
    }
    return colors.extent;
  };
  
  const geoStylerExtent: StyleFunction = () => ({
    color: colors.extent,
    fillColor: colors.extent,
    opacity: 1,
    fillOpacity: 0.8,
  });
  
  const geoStylerImpact: StyleFunction = () => ({
    color: colors.impact,
    fillColor: colors.impact,
    opacity: 1,
    fillOpacity: 0.7,
  });
  
  const geoStylerChange: StyleFunction = (feature, t) => {
    const color = getColor(feature);
    return {
      color,
      fillColor: color,
      opacity: 1,
      fillOpacity: 0.2,
    };
  };
  
  const geoStylerRegion: StyleFunction = (feature) => {
    const properties = feature?.properties || {};
    const bounds = new GeoJSON(feature).getBounds();
  
    if (properties.reg_num === selectedRegion.value) {
      bound.value = bounds;
      console.log("geo zoom", properties, bound.value, selectedRegion);
  
      return {
        color: colors.region,
        opacity: 1,
      };
    } else {
      return {
        color: colors.nocolor,
      };
    }
  };
  
  onMounted(async () => {
    if (process.client) {
      startLoading.value = true;
    }
    loading.value = true;
  });
  
  const handleUpdate = async (newVal: any) => {
    loading.value = true;
    params.value = { layer: newVal.year };
    await updateGeoData();
  
    loading.value = false;
  };
  
  const handleUpdateRight = async (newVal: any) => {
    loading.value = true;
    paramsRight.value = { layer: newVal.year };
    if (compare.value) {
      await updateGeoDataRight();
    }
  
    loading.value = false;
  };
  
  const handleLayerUpdate = async (newVal: any) => {
    loading.value = true;
    selectedLayer.value = newVal.layers;
    if (compare.value) {
      updateLayers(
        leftLayers.value,
        selectedLayer.value,
        geoExtent,
        geoChange,
        geoImpact
      );
      updateSplitControl(); // Update split control with current layers
    }
  
    loading.value = false;
  };
  
  const handleLayerUpdateRight = async (newVal: any) => {
    loading.value = true;
    selectedLayerRight.value = newVal.layers;
  
    if (compare.value) {
      updateLayers(
        rightLayers.value,
        selectedLayerRight.value,
        geoExtentRight,
        geoChangeRight,
        geoImpactRight
      );
      updateSplitControl(); // Update split control with current layers
    }
  
    loading.value = false;
  };
  
  const handleRegionUpdate = async (newVal: { region: string }) => {
    loading.value = true;
    selectedRegion.value = newVal.region;
  
    loading.value = false;
  };
  
  const handleRegionUpdateRight = async (newVal: { region: string }) => {
    loading.value = true;
    selectedRegionRight.value = newVal.region;
  
    loading.value = false;
  };
  
  const handleComparison = async (newVal: { compare: boolean }) => {
    compare.value = newVal.compare;
    loading.value = true;
  
    if (compare.value) {
      await updateGeoDataRight();
  
      //await updateAllLayer();
  
      await initSideBySideMap();
    }
  
    loading.value = false;
  };
  
  const updateGeoData = async () => {
    try {
      geojsonExtent.value = (
        await fetchData("/api/layer", {
          layer: params.value.layer,
          schema: "extent",
        })
      ).data;
      geojsonImpact.value = (
        await fetchData("/api/layer", {
          layer: params.value.layer,
          schema: "impact",
        })
      ).data;
      geojsonChange.value = (
        await fetchData("/api/layer", {
          layer: params.value.layer,
          schema: "change",
        })
      ).data;
    } catch (error) {
      console.error("Error loading GeoJSON data:", error);
    }
  };
  
  const updateGeoDataRight = async () => {
    try {
      geojsonExtentRight.value = (
        await fetchData("/api/layer", {
          layer: paramsRight.value.layer,
          schema: "extent",
        })
      ).data;
      geojsonImpactRight.value = (
        await fetchData("/api/layer", {
          layer: paramsRight.value.layer,
          schema: "impact",
        })
      ).data;
      geojsonChangeRight.value = (
        await fetchData("/api/layer", {
          layer: paramsRight.value.layer,
          schema: "change",
        })
      ).data;
  
      // Ensure the leaflet objects are ready before pushing to rightLayers
    } catch (error) {
      console.error("Error loading GeoJSON data for right layers:", error);
    }
  };
  
  const initSideBySideMap = async () => {
    try {
      await updateAllLayer();
  
      if (leftLayers.value.length > 0 && rightLayers.value.length > 0) {
        splitControl.value = splitMap(
          leftLayers.value,
          rightLayers.value,
          controlOptions.value
        );
        splitControl.value.addTo(lmap.value.leafletObject);
      } else {
        console.error(
          "Left or right layers are empty, unable to initialize side-by-side map."
        );
      }
    } catch (error) {
      console.error("Error initializing split map:", error);
    }
  };
  
  const updateAllLayer = async () => {
    leftLayers.value = [];
    rightLayers.value = [];
  
    updateLayers(
      leftLayers.value,
      selectedLayer.value,
      geoExtent,
      geoChange,
      geoImpact
    );
    updateLayers(
      rightLayers.value,
      selectedLayerRight.value,
      geoExtentRight,
      geoChangeRight,
      geoImpactRight
    );
  };
  
  const updateLayers = (
    layerList,
    selectedLayers,
    extentLayer,
    changeLayer,
    impactLayer
  ) => {
    layerList.length = 0; // Clear existing layers
  
    const addLayerIfSelected = (layer, key) => {
      if (layer && selectedLayers.includes(key) && !layerList.includes(layer)) {
        layerList.push(layer);
      }
    };
  
    addLayerIfSelected(extentLayer.value?.leafletObject, "extent");
    addLayerIfSelected(changeLayer.value?.leafletObject, "change");
    addLayerIfSelected(impactLayer.value?.leafletObject, "impact");
  };
  
  const updateSplitControl = () => {
    if (splitControl.value) {
      splitControl.value.setLeftLayers(leftLayers.value);
      splitControl.value.setRightLayers(rightLayers.value);
    }
  };
  const removeSplitControl = () => {
    if (splitControl.value) {
      splitControl.value.remove();
      splitControl.value = null;
    }
  };
  
  const displayLayer = (sch: string) => selectedLayer.value.includes(sch);
  const displayLayerRight = (sch: string) =>
    selectedLayerRight.value.includes(sch);
  const zoomRegion = () => selectedRegion.value;
  
  watch(compare, (newVal) => {
    if (!newVal) {
      removeSplitControl();
    }
  });
  </script>
  
  <style lang="scss">
  @use "~/assets/css/splitmap.scss";
  
  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
  
  .leaflet-container :deep(.leaflet-popup-close-button) {
    display: none !important;
  }
  .leaflet-container a.leaflet-popup-close-button {
    display: none;
  }
  
  .leaflet-popup-content {
    margin: -2px !important;
    padding: 0;
  }
  
  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: rgb(229, 229, 229);
  }
  </style>
  