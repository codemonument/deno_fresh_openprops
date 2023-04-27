# Readme 

A Deno library by @codemonument to help integrating openprops with Deno's web framework 'fresh'.

**COMMING SOON! 🤩**

## Usage 

1. Create a folder called `css` on the top level of your repo, for all your css files which should have openprops available 
2. Download the necessary openprops css files via `https://deno.land/x/fresh_openprops/download-openprops.ts`
   1. Pass the version you want to download as first param, for example 1.5.8 
   2. Find the newest version by going to <https://unpkg.com/open-props> and reading the version off the url bar
   3. Optional: You can adjust the output folder for this script via the `--outPath` option

## TODOs

- Add a complete 'fresh' installation in example folder (same technique as in rx_webstreams)
- extract the handler for postcss processing together with the cache into an easy function which can simply be dropped into a file-based route file