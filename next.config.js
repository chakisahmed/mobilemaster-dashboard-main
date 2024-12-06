module.exports = {
  async rewrites() {
      return [
          {
              source: '/api/rest/:path*',
              destination: 'http://localhost/rest/:path*',
          },
      ];
  },
  images: {
      remotePatterns: [
          {
              protocol: 'http',
              hostname: 'localhost',
              port: '', 
              pathname: '/media/catalog/product/**', // Match the specific path
          },
      ],
  },
};
   