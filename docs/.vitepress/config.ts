import { defineConfig } from "vitepress";

export default defineConfig({
  title: "npm-ts-template",
  description: "A zero-config TypeScript library template with modern tooling",
  base: "/npm-ts-template/",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/npm-ts-template/favicon.svg",
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "Configuration", link: "/configuration/typescript" },
      { text: "Guides", link: "/guides/writing-code" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [{ text: "Getting Started", link: "/getting-started" }],
      },
      {
        text: "Configuration",
        items: [
          { text: "TypeScript", link: "/configuration/typescript" },
          { text: "Prettier", link: "/configuration/prettier" },
          { text: "ESLint", link: "/configuration/eslint" },
          { text: "Vitest", link: "/configuration/vitest" },
          { text: "Lefthook", link: "/configuration/lefthook" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Writing Code", link: "/guides/writing-code" },
          { text: "Testing", link: "/guides/testing" },
          { text: "Publishing", link: "/guides/publishing" },
          { text: "CI/CD", link: "/guides/ci-cd" },
          { text: "Documentation", link: "/guides/documentation" },
        ],
      },
      {
        text: "Reference",
        items: [{ text: "Scripts", link: "/reference/scripts" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/pyyupsk/npm-ts-template" },
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
