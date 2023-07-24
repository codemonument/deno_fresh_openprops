import type { HandlerContext } from "./deps/fresh.ts";
import { log } from "./deps/std.ts";
import { z } from "./deps/zod.ts";
import {
  cssCache,
  initPostcssInstance,
  loadCss,
  processAndCacheCss,
} from "../mod.ts";

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    "postcss_route": {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

const logger = log.getLogger("postcss_route");

/**
 * @param inputPath The input dir for your own css files, default: './css'
 * @param isProd if true, adds a caching header for the generated css file
 * #@returns
 */
export async function generatePostcssHandler(
  options?: {
    cssInputPath?: string;
    isProd?: boolean;
    postcssModuleDirs?: string[];
  },
) {
  const inputPath = options?.cssInputPath ?? "css";
  const isProd = options?.isProd ?? false;

  // Should only happen once, since this generate Route handler should only run once
  await initPostcssInstance(options?.postcssModuleDirs);

  return async (
    req: Request,
    ctx: HandlerContext,
  ): Promise<Response> => {
    const webservPath = ctx.params.path;
    const fsPath = `${inputPath}/${webservPath}`;
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
    const storedCSSResult = z.string().safeParse(await cssCache.get(fileHash));

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
  };
}
