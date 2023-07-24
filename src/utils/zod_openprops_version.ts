import { ZodSemver } from "../deps/zod.ts";
import { z } from "../deps/zod.ts";

export const ZodOpenPropsVersion = z.union([ZodSemver, z.literal("latest")])
  .optional().default("latest");

export type ZodOpenPropsVersion = z.infer<typeof ZodOpenPropsVersion>;
