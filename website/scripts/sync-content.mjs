import {
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  unlinkSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
const source = fileURLToPath(new URL("../../recipes/", import.meta.url));
const target = fileURLToPath(new URL("../content/recipes/", import.meta.url));
mkdirSync(target, { recursive: true });
if (existsSync(source)) {
  const names = readdirSync(source).filter(
    (name) => name.endsWith(".md") && !name.startsWith("_"),
  );
  for (const name of readdirSync(target))
    if (name.endsWith(".md") && !names.includes(name))
      unlinkSync(`${target}/${name}`);
  for (const name of names)
    copyFileSync(`${source}/${name}`, `${target}/${name}`);
}
