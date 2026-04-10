const path = require('path')

// Build a dynamic list of allowed image hostnames.
// This removes hardcoded IPs — changing servers never requires a code change.
const imageRemotePatterns = [
  { protocol: "https", hostname: "**" },
  { protocol: "http", hostname: "localhost", pathname: "/**" },
  { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
]
// Add the production API host derived from NEXT_PUBLIC_API_URL at build time
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL
if (publicApiUrl) {
  try {
    const { hostname, protocol } = new URL(publicApiUrl)
    const proto = /** @type {"http"|"https"} */ (protocol.replace(":", ""))
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      imageRemotePatterns.push({ protocol: proto, hostname, pathname: "/**" })
    }
  } catch {
    // Invalid URL — skip; dev fallbacks above still apply
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker deployment — creates a self-contained server bundle
  output: 'standalone',
  // Points to monorepo root so standalone correctly traces npm workspace node_modules
  outputFileTracingRoot: path.join(__dirname, '../../'),
  poweredByHeader: false,
  transpilePackages: ["@marsidev/react-turnstile"],
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/anish", destination: "/admin" },
        { source: "/anish/:path*", destination: "/admin/:path*" },
      ],
    };
  },
  // Smaller client bundles for icon + animation libs (tree-shake per-import)
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: imageRemotePatterns,
  },
};

module.exports = nextConfig;
