module.exports = {
  async rewrites() {
      return [
          {
              source: '/api/rest/:path*',
              destination: 'https://ext.web.wamia.tn/rest/:path*',
          },
      ];
  },
  images: {
      remotePatterns: [
          {
              protocol: 'http',
              hostname: 'ext.web.wamia.tn',
              port: '', 
              pathname: '/media/catalog/product/**', // Match the specific path
          },
      ],
  },
};
   