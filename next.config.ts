import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {

    remotePatterns: [
      { protocol: "https", hostname: "webstudio.evolurelabs.com", port: '' },
      { protocol: "https", hostname: "www.facebook.com", port: '' },
    ]
  }
};

export default nextConfig;
