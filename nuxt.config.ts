// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    devServer: {
        host: '127.0.0.1',
        port: 3000,
    },
    modules: ['@nuxt/ui', '@pinia/nuxt'],
    css: ['~/assets/css/main.css'],
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    ui: {
        theme: {
            colors: [
                'primary',
                'secondary',
                'success',
                'info',
                'warning',
                'error',
                'neutral',
            ],
        },
    },
})
