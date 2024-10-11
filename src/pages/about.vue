<template>
  <v-container style="min-height: calc(100vh - 112px)">
    <v-card-title class="text-h5 font-weight-bold mb-4">About</v-card-title>

    <v-card class="mb-6" variant="flat" rounded="lg">
      <v-card-text class="text-justify readable-text">
        GuyMIS is a web application dedicated to monitoring the extent and the
        change of mangroves in Guyana. Mangroves serve as a link between
        terrestrial and marine environments and as such, perform multiple
        functions including coastal protection, livelihoods for coastal
        communities, carbon sequestration, and other countless ecosystem
        services. The loss of mangroves has generated diverse negative climatic,
        social, ecological, and environmental impacts, thereby promoting the
        need for strategic plans for management, protection, and restoration
        actions. Guyana has taken progressive steps to manage its mangrove
        forests by implementing several strategies with National Agricultural
        Research and Extension Institute (NAREI) leading the drive to
        sustainably manage, restore, and monitor the country’s mangrove
        resources since 2010. This web application is a critical component of
        NAREI’s mangrove monitoring system, which integrates GIS, remote
        sensing, field surveys, and community engagement and research to better
        monitor and assess Guyana’s mangroves. The objective of the App is to
        make mangrove-related data freely available to partner organizations,
        government, and civil society on mangrove-related land-use change data
        that will allow for improved and efficient decision-making and actions
        related to hotspots of deforestation; engagement in land-use planning,
        policy-making, and actions that protect mangroves; planning for
        protection of farmers in low-lying coastal areas; and efforts to support
        forest and biodiversity conservation in Guyana. A publication detailing
        the methodology used for this tool is in preparation.
      </v-card-text>
    </v-card>

    <v-card class="mb-6" variant="flat" rounded="lg">
      <v-card-title class="readable-title">
        <v-icon icon="mdi-alert-outline" color="warning" class="mr-2" />
        Disclaimer
      </v-card-title>
      <v-card-text class="readable-text">
        SERVIR Program, NASA, USAID, and SERVIR partner organizations make no
        express or implied warranty of this application as to the
        merchantability or fitness for any particular purpose. Neither the US
        Government nor its contractors shall be liable for special,
        consequential, or incidental damages attributed to this application.
      </v-card-text>
    </v-card>

    <v-card class="mb-6" variant="flat" rounded="lg">
      <v-card-title class="readable-title">Teams</v-card-title>
      <v-row class="mx-auto">
        <v-col
          v-for="(team, index) in teams"
          :key="index"
          cols="12"
          sm="6"
          md="2"
        >
          <v-card
            class="mx-auto d-flex flex-column align-center"
            variant="tonal"
            elevation="3"
            rounded="md"
          >
            <v-avatar
              color="grey"
              size="140"
              class="my-4"
              :src="team.image"
              cover
            >
              <v-img :src="team.image" cover></v-img>
            </v-avatar>
            <v-list-item
              class="text-center readable-title"
              :subtitle="team.affiliation"
              :title="team.name"
            />
            <v-dialog activator="parent" max-width="700">
              <template v-slot:default="{ isActive }">
                <v-card>
                  <div class="d-flex justify-center ma-5">
                    <v-avatar size="150px" class="mr-4" >
                      <v-img :src="team.image" cover></v-img>
                    </v-avatar>
                  </div>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        class="text-h6 readable-title text-center"
                        >{{ team.name }}</v-list-item-title
                      >
                      <v-list-item prepend-icon="mdi-account-outline">
                        {{ team.position }}
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-office-building">
                        {{ team.affiliation }}
                      </v-list-item>
                    </v-list-item-content>
                  </v-list-item>
                  <v-card-text class="text-justify readable-text">
                    {{ team.description }}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn text color="primary" @click="isActive.value = false">
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-divider class="my-6" />

    <v-row align="center" justify="space-around">
      <v-col cols="6" sm="4" md="2">
        <v-img fit src="/logos/amz-alliance.jpg" height="100" />
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <v-img fit src="/logos/ag-ministry.png" height="100" />
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <v-img fit src="/logos/narei.webp" height="100" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { definePageMeta } from "#imports";
definePageMeta({ layout: "custom" });
const teams = [
  {
    name: "Kene Moseley",
    image: "/person/kene.png",
    affiliation: "NAREI",
    position:
      "Project Coordinator of Mangrove Restoration and Management Department",
    description:
      "Kene Moseley is the Project Coordinator of Mangrove Restoration and Management Department of NAREI. Kene has over a decade of experience successfully implementing various restoration interventions along Guyana's coast. She has a Diploma in Project Management, Post Graduate Diploma in Urban Planning and Management and Certificate in Sustainable Environmental Management.",
  },
  {
    name: "Kim Chan-Bagot",
    image: "/person/kim.png",
    affiliation: "NAREI",
    position: "Geographical Information Systems (GIS) Consultant",
    description:
      "Kim Chan-Bagot is a Geographical Information Systems (GIS) Consultant for SERVIR-Amazonia and National Agricultural Research and Extension Institute (NAREI) Mangrove Department. She specializes in the use of optical and radar remote sensing applications for land use and land cover change (particularly in mangrove forest), vulnerability and sensitivity assessments and impact assessments in Guyana. She has a BSc in Geography, MSc in Disaster Risk Management and Climate Governance and MSc in Urban and Regional Planning.",
  },
  {
    name: "Zola Narine",
    image: "/person/zola.jpg",
    affiliation: "NAREI",
    position: "Monitoring/Geographical Information Systems (GIS) Officer",
    description:
      "Zola Narine is the Monitoring/Geographical Information System (GIS) Officer for NAREI’s Mangrove Department. Her work involves management of the Mangrove GIS database and mapping of mangrove forest in Guyana. She holds a Certificate in Agriculture, Diploma in Forestry and BSc in Forestry.",
  },
  {
    name: "Deepak Shah",
    image: "/person/deepak.jpg",
    affiliation: "SERVIR SCO",
    position: "Software Developer",
    description:
      "Deepak is a part of the Geospatial Information Technology team at the SERVIR Science Coordination Office. As a full-stack software engineer, he navigates the entire software development lifecycle, from concept to completion",
  },
  {
    name: "Alexandre Goberna",
    image: "/person/AlexGoberna.jpg",
    affiliation: "SERVIR SCO",
    position: "Software Developer",
    description:
      "Alex is a member of the SERVIR Science Coordination Office's Geospatial Information Technology team. As a fullstack software engineer Alex assists in development and deployment of applications for the SERVIR member hubs.",
  },
];
</script>

<style lang="scss" scoped>
.readable-text {
  font-size: 0.9rem;
  line-height: 1.7;
  letter-spacing: 0.5px;
  color: #424242; /* A dark gray for better contrast */
}

.readable-title {
  font-size: 1.3rem;
  line-height: 1.4;
  font-weight: 600;
  color: #333; /* Darker title color */
}

v-card-title {
  color: #333;
}

.text-justify {
  text-align: justify;
}

.v-avatar img {
  object-fit: cover;
}
</style>
