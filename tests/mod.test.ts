import { assert, describe, it } from "@testing";
import { cssCache, loadCss, prefillCssCache, processAndCacheCss } from "@mod";

describe(`mod.ts`, () => {
  it(`should export correct objects and types`, () => {
    assert(cssCache);
    assert(processAndCacheCss);
    assert(prefillCssCache);
    assert(loadCss);
  });
});
