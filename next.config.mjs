/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow the SVG placeholder art in /public to be served through next/image.
    // Safe here because we only serve our own local SVGs. Swap in real
    // raster images (png/jpg/webp) and you can remove these two lines.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
