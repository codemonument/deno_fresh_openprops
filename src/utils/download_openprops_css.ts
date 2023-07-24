import { fs, log, path } from "../deps/std.ts";
import { z } from "../deps/zod.ts";
import { getLatestOpenProps } from "./getLatestOpenProps.ts";
import { ZodOpenPropsVersion } from "./zod_openprops_version.ts";

const Options = z.object({
  openpropsVersion: ZodOpenPropsVersion
    .default("latest"),
  outPath: z.string().optional().default("css_deps/open-props"),
});

type RawOptions = Partial<z.infer<typeof Options>>;

export async function downloadOpenpropsCss(options: RawOptions) {
  const logger = log.getLogger("FreshOpenProps");
  const { openpropsVersion, outPath } = Options.parse(options);

  const openpropsLatestVersion = await getLatestOpenProps();
  const targetVersion = openpropsVersion === "latest"
    ? openpropsLatestVersion
    : openpropsVersion;

  logger.info(
    `downloadOpenprops with Version ${targetVersion} (latest: ${openpropsLatestVersion})`,
  );

  const baseUrl = `https://unpkg.com/open-props@${targetVersion}`;

  await fs.ensureDir(outPath);
  const openPropsMin = await (await fetch(`${baseUrl}/open-props.min.css`))
    .text();
  await Deno.writeTextFile(
    path.join(outPath, "open-props.min.css"),
    openPropsMin,
  );

  const normalize = await (await fetch(`${baseUrl}/normalize.min.css`))
    .text();
  await Deno.writeTextFile(
    path.join(outPath, "normalize.min.css"),
    normalize,
  );

  const buttons = await (await fetch(`${baseUrl}/buttons.min.css`))
    .text();
  await Deno.writeTextFile(path.join(outPath, "buttons.min.css"), buttons);

  // write version file
  await Deno.writeTextFile(path.join(outPath, "VERSION"), targetVersion);
}
