import { encodeBase64, fs } from "../../deps/std.ts";
import { cssCache } from "./cssCache.ts";
import { postcssInstance } from "./postcssInstance.ts";

async function loadCssIntoCache(file: fs.WalkEntry) {
  const fsPath = file.path;

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
    await loadCssIntoCache(file);
  }

  // don't transform entries in static assets
  // const cssStaticEntries = expandGlob("static/*.css", { root: Deno.cwd() });
  // for await (const file of cssStaticEntries) {
  //   await loadAndProcessAndCacheCss(file);
  // }
}
