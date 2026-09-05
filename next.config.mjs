/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — public property images & brochures.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // Dev-only placeholder imagery until real photography is supplied.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
