module.exports = {
  async rewrites() {
      return [
          {
              source: '/api/rest/:path*',
              destination: 'https://customer.wamia.tn/rest/:path*',
          },
      ];
  },
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'customer.wamia.tn',
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
