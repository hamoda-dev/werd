import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOTS = ["src/app", "src/components"];
/** Literals allowed to remain. Should be EMPTY after migration. */
const ALLOW: string[] = [];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const FILES = ROOTS
  .flatMap((r) => walk(join(process.cwd(), r)))
  .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("__tests__"));

const LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g;

describe("no raw color literals outside tokens", () => {
  for (const file of FILES) {
    it(`${file.replace(process.cwd() + "/", "")} references tokens, not hex/rgba`, () => {
      const matches = (readFileSync(file, "utf8").match(LITERAL) ?? []).filter((m) => !ALLOW.includes(m));
      expect(matches).toEqual([]);
    });
  }
});
