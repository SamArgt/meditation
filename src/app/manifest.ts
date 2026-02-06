import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Meditation",
    short_name: "Meditation",
    description: "Timer de méditation minimaliste avec gongs de bol tibétain",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F5F7F9",
    theme_color: "#5A8F9A",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
