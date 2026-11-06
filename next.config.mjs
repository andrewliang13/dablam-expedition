/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: '/nepal-bhutan/nepal', destination: '/nepal', permanent: true },
      { source: '/nepal-bhutan/bhutan', destination: '/bhutan', permanent: true },
      { source: '/nepal-bhutan', destination: '/#double-feature', permanent: true },
      { source: '/journeys', destination: '/#credits', permanent: true },
      { source: '/about', destination: '/#directors-note', permanent: true },
    ];
  },
};
export default nextConfig;
