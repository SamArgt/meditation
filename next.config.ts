import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: ["/"],
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist({
  output: "standalone",
  turbopack: {},
});
