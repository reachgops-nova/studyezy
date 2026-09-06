/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
