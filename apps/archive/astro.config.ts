import tailwindcss from "@tailwindcss/vite"
import { siteFont } from "@multiverse/ui/fonts"
import { defineConfig } from "astro/config"

import { toolchains } from "./toolchains/integration"

export default defineConfig({
  site: process.env.PUBLIC_ARCHIVE_URL ?? "https://archive.nibras.co",
  output: "static",
  devToolbar: { enabled: false },
  session: false,
  trailingSlash: "ignore",
  // Emits v4/404.html (not v4/404/index.html) so the Worker serves per-edition 404s.
  build: { format: "preserve" },
  // The index page only; editions bring their own period fonts.
  fonts: [siteFont()],
  integrations: [toolchains()],
  vite: {
    plugins: [tailwindcss()],
    // Period CSS (Tachyons, Bulma 0.7…) carries old IE hacks like `*zoom`; drop them, don't fail.
    css: { lightningcss: { errorRecovery: true } },
  },
})
