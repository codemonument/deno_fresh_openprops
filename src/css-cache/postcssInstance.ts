// See: https://www.npmjs.com/package/postcss-jit-props
// CAUTION: these postcss dependencies need to be imported directly here, beause they break when exported from a deps.ts file!
import postcss from "https://deno.land/x/postcss@8.4.16/mod.js";
import postcssImport from "https://esm.sh/postcss-import@15.1.0";
import postcssJitProps from "https://esm.sh/postcss-jit-props@1.0.13";
import pDefer from "https://esm.sh/p-defer@4.0.0";
import { log } from "../deps/std.ts";
import { getLatestOpenProps } from "../utils/getLatestOpenProps.ts";
// Note: OpenProps is imported dynamically below!

const deferred = pDefer<ReturnType<typeof postcss>>();
export const postcssInstancePromise = deferred.promise;

/**
 * CAUTION: This can only be called once per application initialization
 * @param options
 */
export async function initPostcssInstance(
  additionalModuleDirectories?: string[],
  openPropsVersion: "latest" | string = "latest",
) {
  const logger = log.getLogger("FreshOpenProps");

  // Dynamic import OpenProps
  const openPropsUrl = (openPropsVersion === "latest")
    ? `https://esm.sh/open-props`
    : `https://esm.sh/open-props@${openPropsVersion}`;
  const OpenPropsDynamic = await import(openPropsUrl);

  const openPropsLatestVersion = await getLatestOpenProps();
  logger.info(
    `PostCSS init with OpenProps Version ${
      openPropsVersion === "latest" ? openPropsLatestVersion : openPropsVersion
    } (latest: ${openPropsLatestVersion})`,
  );

  // console.log(Object.keys(OpenPropsDynamic.default));

  const additionalModuleDirs = additionalModuleDirectories ?? [];
  const instance = postcss([
    postcssImport({
      addModulesDirectories: [
        ...additionalModuleDirs,
        "css_deps",
      ],
    }),
    postcssJitProps(OpenPropsDynamic.default),
  ]);

  deferred.resolve(instance);

  await postcssInstancePromise;
}
