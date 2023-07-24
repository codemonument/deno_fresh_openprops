/**
 * @returns The latest version for the OpenProps package
 * @throws When the fetch-call errors
 */
export async function getLatestOpenProps() {
  // See: https://www.npmjs.com/package/open-props
  const openPropsLatestVersion = await fetch("https://esm.sh/open-props").then(
    async (res) => {
      const content = await res.text();
      const firstLine = content.split("\n")[0];
      const dirtyVersion = firstLine.split("@")[1];
      const cleanVersion = dirtyVersion.split(" ")[0];
      return cleanVersion;
    },
  );

  return openPropsLatestVersion;
}
