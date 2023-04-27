# Readme 

![](./assets/banner.png)

A Deno library by @codemonument to help integrating openprops with Deno's web framework 'fresh'.

## Usage 

1. Create a folder called `css` on the top level of your repo, for all your css files which should have openprops available 
2. Download the necessary openprops css files via `https://deno.land/x/fresh_openprops/download-openprops.ts`
   1. Pass the version you want to download as first param, for example 1.5.8 
   2. Find the newest version by going to <https://unpkg.com/open-props> and reading the version off the url bar
   3. Optional: You can adjust the output folder for this script via the `--outPath` option
   4. This will create the folder `css_deps/open-props` (if you did not use the --outPath option)
3. Create a route file under `routes/postcss` called `[...path].ts`
   1. The `...path` is important, since this path variable will be used by the generated route handler 
   2. In this file, add the following: 
      ```ts
      import { generatePostcssHandler, prefillCssCache } from "../../../mod.ts";

      export const handler = await generatePostcssHandler();

      await prefillCssCache();

      ``` 
   3. If you used the `--outPath` option when downloading openprops or named your top level folder something other than css, you can adjust this route handler file like this: 
      ```ts
      import { generatePostcssHandler, prefillCssCache } from "../../../mod.ts";

      export const handler = await generatePostcssHandler({
      cssInputPath: "example/css",
      postcssModuleDirs: ["example/css_deps"],
      });

      await prefillCssCache({
      cssInputPath: "example/css",
      });
      ```
   4. Note: The `await prefillCssCache()` call is optional, but recommended. It walks through your `css` folder, runns all css files it finds through postcss and caches the results. 
4. Use your new route in any of your pages (for example in index.tsx): 
   ```tsx
   <Head>
        <title>OpenProps in Deno Fresh</title>
        <link rel="stylesheet" href="/postcss/global.css" />
   </Head>
   ```
   Note: The path after `/postcss/` will directly map into your `css/` directory

## When having issues 

Please report all of your issues at GitHub here: https://github.com/codemonument/deno_fresh_openprops/issues

## Useful Links 

- Github: https://github.com/codemonument/deno_fresh_openprops
- Example Deployment: https://fresh-openprops.deno.dev/
- Deno.Land/x: https://deno.land/x/fresh_openprops
- 