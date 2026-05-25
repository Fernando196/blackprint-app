import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css', 'leaflet.markercluster/dist/MarkerCluster.css'],
  modules: ['@nuxt/eslint', 'dayjs-nuxt', '@pinia/nuxt', '@nuxtjs/leaflet'],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      apiBase: '',
    },
    blobUrl: '',
    BlobReadWriteToken: '',
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300..800&family=Inter:wght@400..700&display=swap',
        },
      ],
    },
  },
})
