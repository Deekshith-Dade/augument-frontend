import type { NextConfig } from "next";

const https_domains = [
  "augmentdata.s3.amazonaws.com",
  "static01.nyt.com", 
  "miro.medium.com",
  "cdn.sanity.io",
  "www.esa.int",
  "static1.squarespace.com",
  "www.nytimes.com",
  "images.newrepublic.com",
  "thedeepdish.org",
  "substackcdn.com "
];

const http_domains = [
  "static1.squarespace.com",
];

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      ...https_domains.map(hostname => ({
        protocol: "https" as const,
        hostname,
      })),
      ...http_domains.map(hostname => ({
        protocol: "http" as const,
        hostname,
      })),
      {
        protocol: "https" as const,
        hostname: "**",
      }
    ],
  },
};

export default nextConfig;
