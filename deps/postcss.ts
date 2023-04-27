export * as postcss from "https://deno.land/x/postcss@8.4.16/mod.js";
import postcssImportPlugin from "https://esm.sh/postcss-import@15.1.0";
import postcssJitPropsPlugin from "https://esm.sh/postcss-jit-props@1.0.13";

export const postcssImport = postcssImportPlugin;
export const postcssJitProps = postcssJitPropsPlugin;
