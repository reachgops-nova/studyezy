/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @napi-rs/canvas ships a native .node binary (lib/pdfCrop.ts, added
  // 2026-09-06 to render+crop real diagrams from a unit's source PDF) -
  // webpack can't parse a binary file as a module, and this package isn't in
  // Next's own default serverExternalPackages list (unlike sharp/canvas,
  // which already are). pdfjs-dist is added alongside it since it also uses
  // Node-specific dynamic requires that don't survive bundling cleanly.
  serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],
  // Real bug found live 2026-09-06: the "Add a unit" page uploads files
  // straight through a Server Action (app/manage/actions.ts's createUnit),
  // which Next.js caps at 1MB by default - any real photo or PDF blew past
  // that instantly, and the browser showed a generic "this page couldn't
  // load" rather than a real error (the request body itself gets rejected
  // before the app's own code, and thus its own error handling, ever runs).
  // Matches this app's own MAX_UPLOAD_FILE_BYTES (12MB/file) with room for
  // several files at once in one multi-file selection.
  experimental: {
    serverActions: {
      bodySizeLimit: "250mb",
    },
  },
};

export default nextConfig;
