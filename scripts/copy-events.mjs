import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("events");
const targetDir = path.resolve("public/events");

fs.mkdirSync(targetDir, { recursive: true });

const files = fs
  .readdirSync(sourceDir)
  .filter((file) => file.endsWith(".yaml"));

for (const file of files) {
  const source = path.join(sourceDir, file);
  const target = path.join(targetDir, file);

  fs.copyFileSync(source, target);

  console.log(`Copied ${file}`);
}