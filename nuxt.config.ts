// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  srcDir: "src/",
  ssr: false,
  devtools: { enabled: false },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/logos/logo.png' }],
      title: 'GuyMIS', // Used in the tab-preview
    },
  },
  modules: ["vuetify-nuxt-module", "@nuxtjs/leaflet"],
  plugins: [
    { src: "~/plugins/highcharts.client.ts", mode: "client" },
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
      customProperties: true
    }
  }
});
