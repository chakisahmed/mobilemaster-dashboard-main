module.exports = {
  async rewrites() {
      return [
          {
              source: '/api/rest/:path*',
              destination: 'https://www.wamia.tn/rest/:path*',
          },
      ];
  },
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'www.wamia.tn',
              port: '', 
              pathname: '/media/catalog/product/**', // Match the specific path
          },
      ],
  },
  // Ensure secure cookies in production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Set-Cookie',
            value: 'Secure; HttpOnly; SameSite=Strict',
          },
        ],
      },
    ];
  },
};
