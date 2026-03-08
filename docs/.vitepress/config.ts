import { defineConfig } from "vitepress";

export default defineConfig({
  title: "@pyyupsk/storehub",
  description: "Unofficial TypeScript client for the StoreHub POS API",
  base: "/storehub/",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/storehub/favicon.png",
      },
    ],
  ],

  themeConfig: {
    logo: {
      src: "/favicon.png",
      width: 24,
      height: 24,
    },

    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "API Reference", link: "/api/client" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Home", link: "/" },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
      {
        text: "API Reference",
        items: [
          { text: "StoreHubClient", link: "/api/client" },
          { text: "Resources", link: "/api/resources" },
          { text: "Type Definitions", link: "/api/types" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/pyyupsk/storehub" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026-present",
    },

    search: {
      provider: "local",
    },
  },
});
