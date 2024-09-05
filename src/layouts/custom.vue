<template>
    <v-layout class="rounded rounded-md">
      <ServirLogos />
      <v-app-bar :elevation="5" density="comfortable" color="primary"  >
        <v-container
          class="d-flex align-center justify-center"
          style="height: 100%"
        >
          <v-row class="d-flex align-center justify-between" style="width: 100%">
            <!-- Title Column -->
            <v-col class="d-flex" cols="8" md="4">
              <VAppBarTitle class="text-h6" >
                <b>{{lgAndUp?'Guyana Mangrove Information System':'GuyMIS'}}</b>
              </VAppBarTitle>
            </v-col>
  
            <!-- Menu Column for large screens -->
            <v-col
              class="d-flex align-center justify-end"
              cols="4"
              md="8"
              v-if="mdAndUp"
            >
              <v-btn prepend-icon="mdi-home"  to="/">Home</v-btn>
              <v-btn prepend-icon="mdi-map"  to="map">Map</v-btn>
              <v-btn prepend-icon="mdi-view-dashboard"  to="dashboard">Dashboard</v-btn>
              <v-btn prepend-icon="mdi-information-variant-circle-outline"  to="about">About</v-btn>
            </v-col>
  
            <!-- Burger Menu for small screens -->
            <v-col class="d-flex align-center justify-end" cols="4" md="8" v-else>
              <v-btn icon @click.stop="drawer = !drawer">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" temporary location="right" width="300" color="primary">
        <v-card color="primary" elevation="0">
          <v-card-title class="text-wrap"><b>Guyana Mangrove Information System</b></v-card-title>
          <v-divider></v-divider>
  
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-home"
              title="Home"
              value="home"
              to="/"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-map"
              title="Map"
              value="Map"
              to="map"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              title="Dashboard"
              value="Dashboard"
              to="dashboard"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-information-variant-circle-outline"
              title="About"
              value="about"
              to="about"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-navigation-drawer>
  
      <v-main>
        <nuxt-page />
        <s-footer/>
  
      </v-main>
  
    </v-layout>
  </template>
  
  <script setup lang="ts">
  import ServirLogos from "../components/layouts/ServirLogos.vue";
  import SFooter from "~/components/layouts/SFooter.vue";
  
  import { useDisplay } from "vuetify";
  const { mdAndUp,lgAndUp } = useDisplay();
  const drawer = ref(false);
  </script>
  
  <style lang="scss" scoped></style>
  