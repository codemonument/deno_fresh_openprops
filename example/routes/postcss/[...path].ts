import { generatePostcssHandler, prefillCssCache } from "../../../mod.ts";

export const handler = await generatePostcssHandler({
  cssInputPath: "example/css",
  postcssModuleDirs: ["example/css_deps"],
});

await prefillCssCache({
  cssInputPath: "example/css",
});
