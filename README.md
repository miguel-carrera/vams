# VTEX Architecture Modeling Specification (VAMS)

VAMS is a formal, JSON-based specification for modeling VTEX solution architectures. It defines a machine-readable representation of components, flows, data entities, governance metadata, and optional e-commerce business context (`metadata.commerce`).

VAMS is **not a diagramming format** — it is a deterministic architecture modeling contract used by Atlas for validation, RFP evaluation, implementation guidance, and risk assessment.

**Full specification:** [`docs/VTEX-Architecture-Modeling-Specification-VAMS.md`](docs/VTEX-Architecture-Modeling-Specification-VAMS.md)

## Repository Contents

This repository defines two related artifact types:

| Artifact | Schema | Purpose |
| -------- | ------ | ------- |
| **Solution architecture** | `schemas/solution-architecture.schema.json` | Models a VTEX solution — nodes, flows, data entities, environments, and optional `metadata.commerce` |
| **Architecture case metadata** | `schemas/architecture-case.metadata.schema.json` | Structured sidecar for solution pattern documents consumed by Atlas and RAG tooling |

It also includes reference documentation, examples, and Miro interoperability mappings.

## Solution Architectures

A VAMS solution architecture document describes the structural and behavioral shape of an implementation:

- **Nodes** — hierarchical components (`Group`, `Platform`, `System`, `Application`, `Middleware`, `Component`)
- **Flows** — data and event interactions between nodes
- **Data entities** — business objects exchanged between systems
- **Environments** — runtime contexts referenced by nodes
- **Metadata** — lifecycle, governance, and optional `metadata.commerce` business context

See the [specification](docs/VTEX-Architecture-Modeling-Specification-VAMS.md) for core concepts, hierarchy constraints, and validation layers. For the full `metadata.commerce` property list, see [`docs/VAMS-Commerce-Metadata-Reference.md`](docs/VAMS-Commerce-Metadata-Reference.md).

## Architecture Case Metadata

Architecture cases capture reusable solution patterns — problem context, recommended approach, trade-offs, and classification signals for Atlas discovery and RAG retrieval.

Each case consists of two files with the same base name:

| File | Role |
| ---- | ---- |
| `case-{slug}.docx` or `case-{slug}.md` | Human-readable case document, vectorised for RAG retrieval |
| `case-{slug}.metadata.json` | Structured metadata sidecar validated against the architecture case schema |

**Example:** `case-b2b-split-payment` → `case-b2b-split-payment.md` + `case-b2b-split-payment.metadata.json`

The `id` field, document filename, and metadata filename must all match.

### Metadata groups

| Group | Description |
| ----- | ----------- |
| **Identity & lifecycle** | `id`, `title`, `version`, `status`, authoring timestamps |
| **context** | Problem space — industry, business model, region, pain points, constraints |
| **solution** | Recommended pattern, VTEX products, integrations, key decisions |
| **tradeoffs** | Alternatives considered, risks, and mitigations |
| **classification** | Tags, related cases, Atlas indexing signals |
| **commerce** | Structured filter signals for RAG and Atlas (not duplicated in the document) |
| **vectorStore** | Pipeline-managed fields written after ingestion — do not author manually |

Full field reference: [`docs/VAMS-Architecture-Case-Schema-Reference.md`](docs/VAMS-Architecture-Case-Schema-Reference.md)

## Documentation

| Document | Description |
| -------- | ----------- |
| [`docs/VTEX-Architecture-Modeling-Specification-VAMS.md`](docs/VTEX-Architecture-Modeling-Specification-VAMS.md) | Canonical VAMS specification |
| [`docs/VAMS-Commerce-Metadata-Reference.md`](docs/VAMS-Commerce-Metadata-Reference.md) | Full `metadata.commerce` property reference |
| [`docs/VAMS-Architecture-Case-Schema-Reference.md`](docs/VAMS-Architecture-Case-Schema-Reference.md) | Architecture case metadata field reference |

## Schemas

VAMS schemas are versioned, immutable artifacts published from this repository. The current release is defined in [`schemas/manifest.json`](schemas/manifest.json).

**URL pattern (pinned release):**

```
https://raw.githubusercontent.com/miguel-carrera/vams/<tag>/schemas/<schema-file>.json
```

Example for release `v1.0.0`:

```
https://raw.githubusercontent.com/miguel-carrera/vams/v1.0.0/schemas/solution-architecture.schema.json
```

Every VAMS document must set `$schema` to the pinned URL for the schema version it was authored against. Do not reference branch names (`master`, `main`) in authored documents.

### Solution Architecture

- **Schema file:** `schemas/solution-architecture.schema.json`
- **Schema ID:** `https://raw.githubusercontent.com/miguel-carrera/vams/v1.0.0/schemas/solution-architecture.schema.json`

### Architecture Case Metadata

- **Schema file:** `schemas/architecture-case.metadata.schema.json`
- **Schema ID:** `https://raw.githubusercontent.com/miguel-carrera/vams/v1.0.0/schemas/architecture-case.metadata.schema.json`

### Releasing a new schema version

1. Apply schema changes on `master`.
2. Bump `version` and `tag` in `schemas/manifest.json`.
3. Update `$id` and `properties.$schema.const` in both schema files to the new tag URL.
4. Open a PR — CI validates the example corpus.
5. Merge, then create and push an annotated git tag matching `manifest.tag` (e.g. `v1.1.0`).

Published tags are immutable. Never rewrite a released tag; ship fixes as a new version.

### Local validation

```bash
npm ci
npm test
```

## Examples

| Path | Description |
| ---- | ----------- |
| [`examples/architectures/architecture-highlevel.json`](examples/architectures/architecture-highlevel.json) | High-level solution architecture with VTEX platform, channels, and integrations |
| [`examples/cases/case-b2b-split-payment.metadata.json`](examples/cases/case-b2b-split-payment.metadata.json) | Architecture case metadata for B2B split payment with ERP credit gate |

## Repository Structure

```
/vams
  /schemas
    manifest.json
    solution-architecture.schema.json
    architecture-case.metadata.schema.json
  /scripts
    validate-examples.js
    check-schema-ids.js
  /examples
    /architectures
      architecture-highlevel.json
    /cases
      case-b2b-split-payment.metadata.json
  /config
    vams-miro-shape-mapping.json
    vams-miro-connector-mapping.json
  /docs
    VTEX-Architecture-Modeling-Specification-VAMS.md
    VAMS-Commerce-Metadata-Reference.md
    VAMS-Architecture-Case-Schema-Reference.md
  README.md
```

The `config/` mappings define how VAMS node types and flow styles translate to Miro board shapes and connectors for diagram interoperability.

## Contributing

Changes to VAMS require a proposal, impact analysis, backward compatibility review, and version increment. See the [governance model](docs/VTEX-Architecture-Modeling-Specification-VAMS.md#9-governance-model) in the specification.
