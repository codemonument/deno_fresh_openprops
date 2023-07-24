/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { FreshOpenProps } from "../mod.ts";
import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

const openpropsPlugin = await FreshOpenProps({
  isProd: false,
  doPrefillCssCache: true,
  cssInputPath: "example/css",
  postcssModuleDirs: ["example/css_deps"],
});

await start(manifest, {
  plugins: [
    openpropsPlugin,
  ],
});
