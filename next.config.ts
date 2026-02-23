import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: ["/", "/sounds/gong-interval.mp3", "/sounds/gong-end.mp3"],
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist({
  output: "standalone",
  turbopack: {},
});
