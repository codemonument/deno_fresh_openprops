import { assert, describe, it } from "@testing";
import { cssCache, loadCssIntoCache, prefillCssCache } from "@mod";

describe(`mod.ts`, () => {
  it(`should export correct objects and types`, () => {
    assert(cssCache);
    assert(loadCssIntoCache);
    assert(prefillCssCache);
  });
});
