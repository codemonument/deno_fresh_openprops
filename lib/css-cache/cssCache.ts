import { kvsMemoryStorage } from "../../deps/kvs_memorystorage.ts";
import { encodeBase64, fs } from "../../deps/std.ts";
import { postcssInstance } from "./postcssInstance.ts";

/**
 * A in-memory key-value storage for deno to cache postcss-transformed css files
 * Needed, bc. these files can't be written to /static, bc. deno deploy does not support writing files to it's file system
 * (it's read-only from the github repo)
 */

export const cssCache = await kvsMemoryStorage({
  name: "css-cache",
  version: 1,
});

/**
 * Loads a css file from a path
 * and calculates it's sha-256 hash for further use
 * @param fsPath
 * @returns
 */
export async function loadCss(fsPath: string) {
  // Load input css file
  const rawCssContent = await Deno.readTextFile(fsPath);

  // Calc SHA256
  const rawCssBytes = new TextEncoder().encode(rawCssContent);
  const fileHashBytes = await crypto.subtle.digest("SHA-256", rawCssBytes);
  const fileHash = encodeBase64(fileHashBytes);

  return { fsPath, rawCssContent, fileHash };
}

export async function loadCssIntoCache(fsPath: string) {
  // Load input css file
  const rawCssContent = await Deno.readTextFile(fsPath);

  // Calc SHA256
  const rawCssBytes = new TextEncoder().encode(rawCssContent);
  const fileHashBytes = await crypto.subtle.digest("SHA-256", rawCssBytes);
  const fileHash = encodeBase64(fileHashBytes);

  const processingResult = await postcssInstance.process(rawCssContent, {
    from: fsPath,
  });
  cssCache.set(fileHash, processingResult.css);

  console.debug(`PostCSS Transformed and Cached: ${fsPath}`, { fileHash });
}

/**
 * Process css files and store them in css cache at server start
 */
export async function prefillCssCache() {
  const cssFileEntries = fs.expandGlob("css/*.css", { root: Deno.cwd() });
  for await (const file of cssFileEntries) {
    const fsPath = file.path;
    await loadCssIntoCache(fsPath);
  }

  // don't transform entries in static assets
  // const cssStaticEntries = expandGlob("static/*.css", { root: Deno.cwd() });
  // for await (const file of cssStaticEntries) {
  //   await loadAndProcessAndCacheCss(file);
  // }
}
