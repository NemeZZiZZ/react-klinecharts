import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// SSR DOM stub for klinecharts
// ---------------------------------------------------------------------------
// klinecharts reads `window.navigator.userAgent` at module-load time (its
// `isAppleOS()` runs eagerly to build a hotkey table). During Astro's static
// build that code runs in Node, where `window` is undefined. Installing this
// stub at config load time — before any page renders — lets klinecharts import
// cleanly on the server. It's a no-op in the browser (where `window` exists),
// and the chart itself only ever mounts client-side (`client:only="react"`).
if (typeof (globalThis as { window?: unknown }).window === "undefined") {
  const nav = { userAgent: "Astro SSR" };
  (globalThis as Record<string, unknown>).window = {
    navigator: nav,
    matchMedia: () => ({ addEventListener() {}, removeEventListener() {} }),
    requestAnimationFrame: (cb: FrameRequestCallback) =>
      setTimeout(() => cb(0), 0),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
    addEventListener() {},
    removeEventListener() {},
  };
  if (typeof (globalThis as { navigator?: unknown }).navigator === "undefined") {
    (globalThis as Record<string, unknown>).navigator = nav;
  }
}

// Resolve the wrapper source directly (like the old `example/` app did), so the
// docs site always reflects the current library code without a publish step.
const wrapperSrc = fileURLToPath(new URL("../src/index.ts", import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://nemezzizz.github.io",
  base: "/react-klinecharts/",
  integrations: [
    starlight({
      title: "react-klinecharts",
      description:
        "A flexible React wrapper for KlineCharts with hooks, declarative sub-components, and full TypeScript support.",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: true,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/NemeZZiZZ/react-klinecharts",
        },
        {
          icon: "npm",
          label: "npm",
          href: "https://www.npmjs.com/package/react-klinecharts",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "getting-started/introduction" },
            { label: "Installation", slug: "getting-started/installation" },
            { label: "Quick Start", slug: "getting-started/quick-start" },
          ],
        },
        {
          label: "Guide",
          items: [{ autogenerate: { directory: "guide" } }],
        },
        {
          label: "Components",
          items: [{ autogenerate: { directory: "components" } }],
        },
        {
          label: "Hooks",
          items: [{ autogenerate: { directory: "hooks" } }],
        },
        {
          label: "Reference",
          items: [{ autogenerate: { directory: "reference" } }],
        },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
    react(),
  ],
  vite: {
    resolve: {
      alias: {
        "react-klinecharts": wrapperSrc,
      },
    },
  },
});
