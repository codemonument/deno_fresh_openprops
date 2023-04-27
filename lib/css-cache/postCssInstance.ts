// See: https://www.npmjs.com/package/postcss-jit-props
// CAUTION: these postcss dependencies need to be imported directly here, beause they break when exported from a deps.ts file!
import postcss from "https://deno.land/x/postcss@8.4.16/mod.js";
import postcssImport from "https://esm.sh/postcss-import@15.1.0";
import postcssJitProps from "https://esm.sh/postcss-jit-props@1.0.13";

// See: https://www.npmjs.com/package/open-props
import { OpenProps } from "../../deps/openprops.ts";

export const postcssInstance = postcss([
  postcssImport({
    addModulesDirectories: ["css_deps"],
  }),
  postcssJitProps(OpenProps),
]);
