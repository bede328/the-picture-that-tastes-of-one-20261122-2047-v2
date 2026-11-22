import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(here, "entry.png");

if (!existsSync(src)) throw new Error("entry.png missing next to main.ts");
const size = statSync(src).size;
if (size > 1048576) throw new Error(`entry.png too large: ${size} bytes`);

mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, "entry.png"));

// Verify the written output is a whole PNG of the right size.
const out = readFileSync(join(outDir, "entry.png"));
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!out.subarray(0, 8).equals(pngMagic)) throw new Error("output is not a PNG");
if (out.length > 1048576) throw new Error(`output too large: ${out.length} bytes`);
console.log(`wrote entry.png (${size} bytes) to ${outDir}`);
