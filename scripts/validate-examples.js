import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { getManifest } from "./lib/schema-urls.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const schemasDir = join(root, "schemas");
const manifest = getManifest();

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  strictRequired: false,
  validateSchema: false,
});
addFormats(ajv);

const solutionSchema = JSON.parse(
  readFileSync(
    join(schemasDir, manifest.schemas.solutionArchitecture),
    "utf8"
  )
);
const caseSchema = JSON.parse(
  readFileSync(
    join(schemasDir, manifest.schemas.architectureCaseMetadata),
    "utf8"
  )
);

const validateSolution = ajv.compile(solutionSchema);
const validateCase = ajv.compile(caseSchema);

const corpora = [
  {
    label: "solution architectures",
    dir: join(root, "examples/architectures"),
    validate: validateSolution,
  },
  {
    label: "architecture case metadata",
    dir: join(root, "examples/cases"),
    validate: validateCase,
    glob: ".metadata.json",
  },
];

let failed = false;

for (const { label, dir, validate, glob = ".json" } of corpora) {
  const files = readdirSync(dir)
    .filter((name) => name.endsWith(glob))
    .sort();

  if (files.length === 0) {
    console.error(`No example files found in ${dir}`);
    failed = true;
    continue;
  }

  for (const file of files) {
    const path = join(dir, file);
    const doc = JSON.parse(readFileSync(path, "utf8"));

    if (!validate(doc)) {
      console.error(`\n${path} failed ${label} validation:`);
      for (const error of validate.errors ?? []) {
        console.error(`  - ${error.instancePath || "/"} ${error.message}`);
      }
      failed = true;
    } else {
      console.log(`OK  ${path}`);
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log(`\nAll examples validate against VAMS schema ${manifest.tag}.`);
