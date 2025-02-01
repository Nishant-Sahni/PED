export default function manifest() {
    return {
      name: 'Next.js PWA',
      short_name: 'NextPWA',
      description: 'A Progressive Web App built with Next.js',
      start_url: '/scanQR',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [
        {
          src: '/logo.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/logo.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    }
  }