import { assert, describe, it } from "@testing";
import { dummyExport } from "@mod";

describe(`mod.ts`, () => {
  it(`should export correct objects and types`, () => {
    assert(dummyExport);
  });
});
