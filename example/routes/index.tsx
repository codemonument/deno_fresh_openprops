import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>OpenProps in Deno Fresh</title>
        <link rel="stylesheet" href="/postcss/global.css" />
      </Head>
      <main> 
        {/* <h1 class="gradient-text ">OpenProps in Deno Fresh</h1> */}
        <h1>OpenProps in Deno Fresh</h1>
      </main>
    </>
  );
}
