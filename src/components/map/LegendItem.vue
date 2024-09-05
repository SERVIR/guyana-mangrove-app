<template>
  <v-container class="pa-0">
    <v-row align="center" no-gutters>
      <v-col cols="auto" class="px-0">
        <div
          class="color-indicator"
          :style="{ backgroundColor: color }"
        ></div>
      </v-col>

      <v-col class="pl-4">{{ legendName }}</v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  color: {
    type: String,
    required: true,
  },
  legendName: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.color-indicator {
  width: 20px;
  height: 20px;
}

.v-row.no-gutters {
  margin: 0;
}

.v-col.px-0 {
  padding-left: 0;
  padding-right: 0;
}
</style>
