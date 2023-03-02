import {} from "@mod";
import { VERSION } from "@version";
import { log } from "@deps/std_log.ts";

try {
  log.info(`Module Version (version.ts): ${VERSION}`);
} catch (error) {
  console.error(error);
  Deno.exit();
}
