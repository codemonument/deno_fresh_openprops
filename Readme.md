# Readme

![](./assets/banner.png)

A Deno library by @codemonument to help integrating openprops with Deno's web framework 'fresh'.

## Links

[GitHub](https://github.com/codemonument/deno_fresh_openprops) | [Deno.Land/x](https://deno.land/x/fresh_openprops) | [Example Deployment](https://fresh-openprops.deno.dev/)

## Usage

1. Create a folder called `css` on the top level of your repo, for all your css files which should have openprops available
2. Download the necessary openprops css files via `https://deno.land/x/fresh_openprops/download-openprops-cli.ts`
   1. The latest version will be downloaded by default.
      For a special version, pass it as the first argument, for example 1.5.8
   2. Optional: You can adjust the output folder for this script via the `--outPath` option
   3. This will create the folder `css_deps/open-props` (if you did not use the --outPath option)
3. Import the plugin via

   ```ts
   // In main.ts
   import {FreshOpenProps} from 'https://deno.land/x/fresh_openprops';

   await start(manifest, {
   	plugins: [
   		await FreshOpenProps({
   			// OPTIONAL, default false
   			isProd: false,

   			// OPTIONAL, default true: When doPrefillCssCache is true, the plugin will crawl the cssInputPath and process and cache all css files it can find.
   			doPrefillCssCache: true,

   			// OPTIONAL, default 'css: Where to find your input css files which use the openprop variables
   			// If you named your top-level folder something else than '/css' or placed it somewhere different, adjust here!
   			cssInputPath: 'example/css',

   			// OPTIONAL, default 'css_deps': The folder where your source openprops css files are located (probably downloaded via download-openprops-cli)
   			// If you used the `--outPath` option when downloading openprops, pass it here!
   			postcssModuleDirs: ['example/css_deps'],
   		}),
   	],
   });
   ```

4. Use the new route from the plugin in any of your pages (for example in index.tsx):
   ```tsx
   <Head>
   	<title>OpenProps in Deno Fresh</title>
   	<link rel="stylesheet" href="/postcss/global.css" />
   </Head>
   ```
   Note: The path after `/postcss/` will directly map into your `css/` directory when configured with standard values as described above

## Any Issues?

Please report all of your issues at GitHub here: https://github.com/codemonument/deno_fresh_openprops/issues
