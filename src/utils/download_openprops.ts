import { fs, log, path } from "../deps/std.ts";
import { z, ZodSemver } from "../deps/zod.ts";
import { getLatestOpenProps } from "./getLatestOpenProps.ts";

const Options = z.object({
  openPropsVersion: z.union([ZodSemver, z.literal("latest")]).optional()
    .default("latest"),
  outPath: z.string().optional().default("css_deps/open-props"),
});

export async function downloadOpenprops(
  options: { openPropsVersion?: string; outPath?: string },
) {
  const logger = log.getLogger("FreshOpenProps");
  const { openPropsVersion, outPath } = Options.parse(options);

  const openPropsLatestVersion = await getLatestOpenProps();
  const targetVersion = openPropsVersion === "latest"
    ? openPropsLatestVersion
    : openPropsVersion;

  logger.info(
    `downloadOpenprops with Version ${targetVersion} (latest: ${openPropsLatestVersion})`,
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
