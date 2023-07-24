// See: https://www.npmjs.com/package/postcss-jit-props
// CAUTION: these postcss dependencies need to be imported directly here, beause they break when exported from a deps.ts file!
import postcss from "https://deno.land/x/postcss@8.4.16/mod.js";
import postcssImport from "https://esm.sh/postcss-import@15.1.0";
import postcssJitProps from "https://esm.sh/postcss-jit-props@1.0.13";
// See: https://www.npmjs.com/package/open-props
// IMPORTANT: do not re-export this url from a deps.ts file, will break!
import OpenProps from "https://esm.sh/open-props@1.5.10";
import pDefer from "https://esm.sh/p-defer@4.0.0";

const deferred = pDefer<ReturnType<typeof postcss>>();

export const postcssInstancePromise = deferred.promise;

/**
 * CAUTION: This can only be called once per application initialization
 * @param options
 */
export async function initPostcssInstance(
  additionalModuleDirectories?: string[],
) {
  const additionalModuleDirs = additionalModuleDirectories ?? [];
  const instance = postcss([
    postcssImport({
      addModulesDirectories: [
        ...additionalModuleDirs,
        "css_deps",
      ],
    }),
    postcssJitProps(OpenProps),
  ]);

  deferred.resolve(instance);

  await postcssInstancePromise;
}
