import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getManifest, getSchemaUrl } from "./lib/schema-urls.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemasDir = join(__dirname, "../schemas");

const manifest = getManifest();
const checks = [
  {
    file: manifest.schemas.solutionArchitecture,
    expectedId: getSchemaUrl("solutionArchitecture"),
    schemaKey: "solutionArchitecture",
  },
  {
    file: manifest.schemas.architectureCaseMetadata,
    expectedId: getSchemaUrl("architectureCaseMetadata"),
    schemaKey: "architectureCaseMetadata",
  },
];

let failed = false;

for (const { file, expectedId, schemaKey } of checks) {
  const schema = JSON.parse(readFileSync(join(schemasDir, file), "utf8"));

  if (schema.$id !== expectedId) {
    console.error(
      `${file}: $id must be ${expectedId}, got ${schema.$id ?? "(missing)"}`
    );
    failed = true;
  }

  const schemaConst = schema.properties?.$schema?.const;
  if (schemaConst !== expectedId) {
    console.error(
      `${file}: properties.$schema.const must be ${expectedId}, got ${schemaConst ?? "(missing)"}`
    );
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log(
  `Schema $id and $schema const values match manifest ${manifest.tag}.`
);
