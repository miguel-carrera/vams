import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(join(__dirname, "../../schemas/manifest.json"), "utf8")
);

const BASE = `https://raw.githubusercontent.com/${manifest.repository}/${manifest.tag}/schemas`;

export function getSchemaUrl(schemaKey) {
  const filename = manifest.schemas[schemaKey];
  if (!filename) {
    throw new Error(`Unknown schema key: ${schemaKey}`);
  }
  return `${BASE}/${filename}`;
}

export function getManifest() {
  return manifest;
}
