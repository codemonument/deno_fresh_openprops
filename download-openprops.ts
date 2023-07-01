import { ensureDir } from "https://deno.land/std@0.178.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.178.0/path/mod.ts";
import {
  ArgumentValue,
  Command,
} from "https://deno.land/x/cliffy@v0.25.7/mod.ts";
import { ZodSemver } from "https://deno.land/x/zod_semver@1.0.2/mod.ts";

/**
 * This file is a little cliffy command line script to download a specific version of openprops into the local repositiory
 * for use via the generatePostcssHandler() function from this pacakge.
 *
 * You can find the latest version of openprops by opening https://unpkg.com/open-props in your browser
 * and looking at the url bar.
 *
 * After that, you can use the following command line to use this script directly from deno.land/x:
 * (Replace the version at the end with the most recent one you found)
 * deno run --allow-net --allow-write --allow-read https://deno.land/x/fresh_openprops/download-openprops.ts 1.5.10
 */
export const denoLandXDescription =
  "This prop is only here to show the multiline comment above on https://deno.land/x/fresh_openprops@1.0.1/download-openprops.ts";

await new Command()
  .name("download-openprops")
  .description(
    `Downloads the specified version of openprops into a local directory for further use`,
  )
  .option(
    "- --outPath <outPath>",
    "The output path to save the openprops files to. Defaults to <cwd>/css_deps/open-props",
  )
  .type("semver", ({ label, name, value }: ArgumentValue) => {
    return ZodSemver.parse(value);
  })
  .arguments("<openpropsVersion:semver>")
  .action(async (options, ...args) => {
    // Find Latest version via: https://unpkg.com/open-props
    const [version] = args;
    const baseUrl = `https://unpkg.com/open-props@${version}`;
    const targetDir = options.outPath ?? `css_deps/open-props`;

    await ensureDir(targetDir);
    const openPropsMin = await (await fetch(`${baseUrl}/open-props.min.css`))
      .text();
    await Deno.writeTextFile(
      join(targetDir, "open-props.min.css"),
      openPropsMin,
    );

    const normalize = await (await fetch(`${baseUrl}/normalize.min.css`))
      .text();
    await Deno.writeTextFile(join(targetDir, "normalize.min.css"), normalize);

    const buttons = await (await fetch(`${baseUrl}/buttons.min.css`))
      .text();
    await Deno.writeTextFile(join(targetDir, "buttons.min.css"), buttons);

    // write version file
    await Deno.writeTextFile(join(targetDir, "VERSION"), version);
  })
  .parse(
    Deno.args,
  );
