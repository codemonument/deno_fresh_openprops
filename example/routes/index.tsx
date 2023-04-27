import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>OpenProps in Deno Fresh</title>
        <link rel="stylesheet" href="/postcss/global.css" />
      </Head>
      <main> 
        <h1 class="gradient-text ">OpenProps in Deno Fresh</h1>
        <nav>
          <a href="https://github.com/codemonument/deno_fresh_openprops" target="_blank"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h14v-7h2v7q0 .825-.588 1.413T19 21H5Zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4l-9.3 9.3Z"/></svg> 
            GitHub
          </a>

          <a href="https://deno.land/x/fresh_openprops" target="_blank"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h14v-7h2v7q0 .825-.588 1.413T19 21H5Zm4.7-5.3l-1.4-1.4L17.6 5H14V3h7v7h-2V6.4l-9.3 9.3Z"/></svg> 
            Deno.Land/x
          </a>

        </nav>
      </main>
    </>
  );
}
