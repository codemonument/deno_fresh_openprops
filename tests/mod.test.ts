import { assert, describe, it } from "./deps.ts";
import * as mod from "@mod";

describe(`mod.ts`, () => {
  it(`should export correct objects and types`, () => {
    assert(mod.cssCache);
    assert(mod.processAndCacheCss);
    assert(mod.prefillCssCache);
    assert(mod.loadCss);
    assert(mod.generatePostcssHandler);
    assert(mod.postcssInstance);
  });
});
