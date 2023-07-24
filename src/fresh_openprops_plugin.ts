import { PluginRoute } from "https://deno.land/x/fresh@1.3.1/src/server/types.ts";
import { cssCache, prefillCssCache } from "./css-cache/cssCache.ts";
import { processAndCacheCss } from "./css-cache/cssCache.ts";
import { loadCss } from "./css-cache/cssCache.ts";
import { initPostcssInstance } from "./css-cache/postcssInstance.ts";
import { Plugin } from "./deps/fresh.ts";
import type { HandlerContext } from "./deps/fresh.ts";
import { fs, log, path } from "./deps/std.ts";
import { z } from "./deps/zod.ts";
import { downloadOpenpropsCss } from "./utils/download_openprops_css.ts";
import { ZodOpenPropsVersion } from "./utils/zod_openprops_version.ts";

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    "FreshOpenProps": {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

const logger = log.getLogger("FreshOpenProps");

const PluginOptions = z.object({
  doPrefillCssCache: z.boolean().optional().default(true),
  isProd: z.boolean().optional().default(false),
  cssInputPath: z.string().optional().default(`css`),
  postcssModuleDirs: z.array(z.string()).optional().default([]),
  openpropsVersion: ZodOpenPropsVersion,
  postcssModuleBaseDir: z.string().optional().default("css_deps"),
});

export type PluginOptions = z.infer<typeof PluginOptions>;
export type RawPluginOptions = Partial<PluginOptions>;

export async function FreshOpenProps(rawOptions?: RawPluginOptions) {
  // Throws when option parsing fails
  const {
    cssInputPath,
    postcssModuleDirs,
    isProd,
    doPrefillCssCache,
    postcssModuleBaseDir,
    openpropsVersion,
  } = PluginOptions.parse(
    rawOptions,
  );

  // TODO: Improve guard to only download files when the specific version is not there
  if (!isProd) {
    await downloadOpenpropsCss({
      openpropsVersion,
      outPath: path.join(postcssModuleBaseDir, "open-props"),
    });
  }

  postcssModuleDirs.push(postcssModuleBaseDir);

  // Should only happen once, since this plugin is only initialized once
  await initPostcssInstance({ postcssModuleDirs });

  if (doPrefillCssCache) {
    await prefillCssCache({ cssInputPath });
  }

  const postcssRoute = {
    path: "/postcss/[...path]",
    handler: async (
      req: Request,
      ctx: HandlerContext,
    ): Promise<Response> => {
      const webservPath = ctx.params.path;
      const fsPath = `${cssInputPath}/${webservPath}`;
      const reqEtag = req.headers.get(`If-None-Match`);

      // Load input css file
      const { fileHash, rawCssContent } = await loadCss(fsPath);

      // validate etag sent by client agains the requested file
      // slice away first two chars, bc. they indicate weak etag comparison with "W/"
      if (reqEtag !== null && reqEtag.slice(2) === fileHash) {
        return new Response(null, {
          status: 304,
          statusText: "Not Modified",
          headers: new Headers([
            ["ETag", reqEtag],
          ]),
        });
      }

      // Check cache
      if (!await cssCache.has(fileHash)) {
        // On cache miss: process css file and cache it
        await processAndCacheCss({ fsPath, rawCssContent, fileHash });
      }

      // Get storedCSS from cache
      const storedCSSResult = z.string().safeParse(
        await cssCache.get(fileHash),
      );

      if (storedCSSResult.success === false) {
        return new Response(null, {
          status: 500,
          statusText:
            "Css not available in cache after processing, should not happen!",
        });
      }

      logger.debug(`PostCSS found in cache: ${fsPath}`, { fileHash });

      const cachingHeader: [string, string][] = (isProd)
        ? [
          // Cache the css files for min 1h (3600sek) and max-age=604800, then use the old file while revalidating
          [
            "Cache-Control",
            "public, max-age=604800, stale-while-revalidate=3600",
          ],
          ["ETag", fileHash],
        ]
        : [];

      // deliver stored css
      return new Response(storedCSSResult.data, {
        headers: new Headers([
          ["Content-Type", "text/css"],
          ...cachingHeader,
        ]),
      });
    },
  } satisfies PluginRoute;

  return {
    name: "openprops",
    routes: [postcssRoute],
  } satisfies Plugin;
}
