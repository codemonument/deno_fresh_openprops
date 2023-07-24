import {
  ArgumentValue,
  Command,
} from "https://deno.land/x/cliffy@v0.25.7/mod.ts";
import { ZodSemver } from "https://deno.land/x/zod_semver@1.1.0/mod.ts";
// CAUTION: Do not import via ./mod.ts, otherwise this script needs dependency access to $fresh! :O
import { downloadOpenprops } from "./src/utils/download_openprops.ts";

/**
 * This file is a little cliffy command line script to download a specific version of openprops into the local repositiory
 * for use via the generatePostcssHandler() function from this package. ...
 *
 * You can find the latest version of openprops by opening https://unpkg.com/open-props in your browser
 * and looking at the url bar.
 *
 * After that, you can use the following command line to use this script directly from deno.land/x:
 * (Replace the version at the end with the most recent one you found)
 * deno run --allow-net --allow-write --allow-read https://deno.land/x/fresh_openprops/download-openprops.ts 1.5.10
 */
export const fileDescription =
  "This prop is only here to show the multiline comment above on https://deno.land/x/fresh_openprops/download-openprops.ts";

await new Command()
  .name("download-openprops")
  .description(
    `Downloads the specified version of openprops into a local directory for further use. Default version is 'latest', which downloads the latest version automatically. `,
  )
  .option(
    "- --outPath <outPath>",
    "The output path to save the openprops files to. Defaults to <cwd>/css_deps/open-props",
  )
  .type("semver", ({ label, name, value }: ArgumentValue) => {
    return ZodSemver.parse(value);
  })
  .arguments("[openpropsVersion:semver]")
  .action(async (options, ...args) => {
    // For 'latest' version, simply pass no version at all.
    // Alternative: Find latest version manually via: https://unpkg.com/open-props
    const [version] = args;
    await downloadOpenprops({
      openPropsVersion: version,
      outPath: options?.outPath,
    });
  })
  .parse(
    Deno.args,
  );
