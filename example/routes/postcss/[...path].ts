import { generatePostcssHandler } from "../../../mod.ts";

export const handler = await generatePostcssHandler({
  cssInputPath: "example/css",
  postcssModuleDirs: ["example/css_deps"],
});
