<template>
  <div class="leaflet-sbs" ref="container">
    <div class="leaflet-sbs-divider" ref="divider"></div>
    <input
      class="leaflet-sbs-range"
      type="range"
      min="0"
      max="1"
      step="any"
      value="0.5"
      ref="range"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'

// Define props for left and right layers
const props = defineProps({
  leftLayers: Array,
  rightLayers: Array,
  thumbSize: {
    type: Number,
    default: 42
  },
  padding: {
    type: Number,
    default: 0
  }
})

// Refs to access DOM elements
const container = ref(null)
const divider = ref(null)
const range = ref(null)

// Variables to store map state
let map = null
let mapWasDragEnabled = false
let mapWasTapEnabled = false
let leftLayer = null
let rightLayer = null

// Function to update the clip styles
const updateClip = () => {
  if (!map || !range.value) return
  const nw = map.containerPointToLayerPoint([0, 0])
  const se = map.containerPointToLayerPoint(map.getSize())
  const clipX = nw.x + getPosition()
  const dividerX = getPosition()

  divider.value.style.left = `${dividerX}px`
  const clipLeft = `rect(${nw.y}px, ${clipX}px, ${se.y}px, ${nw.x}px)`
  const clipRight = `rect(${nw.y}px, ${se.x}px, ${se.y}px, ${clipX}px)`

  if (leftLayer) {
    leftLayer.getContainer().style.clip = clipLeft
  }
  if (rightLayer) {
    rightLayer.getContainer().style.clip = clipRight
  }
}

// Function to update layers
const updateLayers = () => {
  if (!map) return
  const prevLeft = leftLayer
  const prevRight = rightLayer
  leftLayer = props.leftLayers.find(layer => map.hasLayer(layer)) || null
  rightLayer = props.rightLayers.find(layer => map.hasLayer(layer)) || null
  if (prevLeft !== leftLayer) {
    if (prevLeft) map.fire('leftlayerremove', { layer: prevLeft })
    if (leftLayer) map.fire('leftlayeradd', { layer: leftLayer })
  }
  if (prevRight !== rightLayer) {
    if (prevRight) map.fire('rightlayerremove', { layer: prevRight })
    if (rightLayer) map.fire('rightlayeradd', { layer: rightLayer })
  }
  updateClip()
}

// Function to get position of the slider
const getPosition = () => {
  const rangeValue = range.value
  const offset = (0.5 - rangeValue) * (2 * props.padding + props.thumbSize)
  return map.getSize().x * rangeValue + offset
}

// Add event listeners
const addEvents = () => {
  if (!map || !range.value) return
  map.on('move', updateClip)
  map.on('layeradd layerremove', updateLayers)
  range.value.addEventListener(getRangeEvent(range.value), updateClip)
  range.value.addEventListener('touchstart', cancelMapDrag)
  range.value.addEventListener('touchend', uncancelMapDrag)
  range.value.addEventListener('mousedown', cancelMapDrag)
  range.value.addEventListener('mouseup', uncancelMapDrag)
}

// Remove event listeners
const removeEvents = () => {
  if (!map || !range.value) return
  range.value.removeEventListener(getRangeEvent(range.value), updateClip)
  range.value.removeEventListener('touchstart', cancelMapDrag)
  range.value.removeEventListener('touchend', uncancelMapDrag)
  range.value.removeEventListener('mousedown', cancelMapDrag)
  range.value.removeEventListener('mouseup', uncancelMapDrag)
  map.off('layeradd layerremove', updateLayers)
  map.off('move', updateClip)
}

// Utility function for range event
const getRangeEvent = (rangeInput) => 'oninput' in rangeInput ? 'input' : 'change'

// Cancel map drag events
const cancelMapDrag = () => {
  mapWasDragEnabled = map.dragging.enabled()
  mapWasTapEnabled = map.tap && map.tap.enabled()
  map.dragging.disable()
  map.tap && map.tap.disable()
}

// Restore map drag events
const uncancelMapDrag = (e) => {
  if (mapWasDragEnabled) map.dragging.enable()
  if (mapWasTapEnabled) map.tap.enable()
}

// Initialize the control
onMounted(() => {
  map = this.$map // Access map instance from Leaflet
  if (map) {
    addEvents()
    updateLayers()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (map) {
    removeEvents()
  }
})

// Watch for changes in props
watch(() => props.leftLayers, updateLayers, { deep: true })
watch(() => props.rightLayers, updateLayers, { deep: true })
</script>

<style scoped>
.leaflet-sbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: ew-resize;
}

.leaflet-sbs-divider {
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: #000;
  z-index: 1000;
}

.leaflet-sbs-range {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
