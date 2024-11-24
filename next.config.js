module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/rest/:path*',
          destination: 'https://ext.web.wamia.tn/rest/:path*',
        },
      ];
    },
  };