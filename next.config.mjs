/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ykaczfpufymmjumcimgg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/listing-images/**',
      },
    ],
  },
}

export default nextConfig
