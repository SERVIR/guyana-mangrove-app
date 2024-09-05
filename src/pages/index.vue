<template>
  <div >
    <v-parallax src="/image/hero.jpg" height="60vh">
      <div class="d-flex flex-column align-center justify-center fill-height text-center text-white px-5 py-4" style="background: rgba(0, 0, 0, 0.4);">
        <h1 class="display-1 font-weight-light mb-2">
          Guyana Mangrove Information System (GuyMIS)
        </h1>
        <h4 class="headline font-weight-regular">Explore Guyana Mangrove Data</h4>
      </div>
    </v-parallax>

    <v-container class="mt-10 mb-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="elevation-4 rounded-lg" height="300px">
            <v-img
              gradient="to bottom, rgba(0,0,0,.2), rgba(0,0,0,.8)"
              cover
              src="/image/map.jpg"
              class="align-end"
              height="100%"
            >
              <v-card-item class="px-4 pb-2 d-flex flex-column justify-end">
                <v-card-title class="text-h6 text-wrap text-white">
                  Explore the extent, changes, and restoration of Guyana's
                  mangroves on an interactive map.
                </v-card-title>
              </v-card-item>
              <v-card-actions class="px-4">
                <v-spacer />
                <v-btn prepend-icon="mdi-map" to="map" class="bg-primary">
                  Explore
                </v-btn>
              </v-card-actions>
            </v-img>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="elevation-4 rounded-lg" height="300px">
            <v-img
              gradient="to bottom, rgba(0,0,0,.2), rgba(0,0,0,.8)"
              cover
              src="/image/dashboard.jpg"
              class="align-end"
              height="100%"
            >
              <v-card-item class="px-4 pb-2 d-flex flex-column justify-end">
                <v-card-title class="text-h6 text-wrap text-white">
                  Dashboard provides an interactive view of mangrove data,
                  tracking restoration, changes, and extent through analytics.
                </v-card-title>
              </v-card-item>
              <v-card-actions class="px-4">
                <v-spacer />
                <v-btn prepend-icon="mdi-view-dashboard" to="dashboard" class="bg-primary">
                  Dashboard
                </v-btn>
              </v-card-actions>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
</style>
