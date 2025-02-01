export default function manifest() {
    return {
      name: 'PED',
      short_name: 'PED',
      description: 'Digitized Entry/Exit for IIT Ropar',
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
