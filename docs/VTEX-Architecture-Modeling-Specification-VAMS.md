# VTEX Architecture Modeling Specification (VAMS)

Created: Feb 17, 2026
Status: Draft | Discussion | Approved | Dropped
Current Version: 1.0
Creator: Miguel Carrera

---

## 1. Overview

The VTEX Architecture Modeling Specification (VAMS) is a formal, JSON-based specification for modeling solution architectures across the VTEX ecosystem.

VAMS defines a structured, machine-readable representation of:

- Architectural components and systems
- Relationships and hierarchical composition
- Data and event flows
- Business entities exchanged between systems
- Governance and lifecycle metadata
- Optional e-commerce business context (`metadata.commerce`)

It serves as the canonical architecture modeling language for:

- Atlas Architecture Validation
- Partner Self-Validation
- RFP Technical Evaluation
- Implementation Guidance Generation
- Risk & Compliance Assessment

VAMS is **not a diagramming format**.  
It is a **deterministic architecture modeling contract**.

---

## 2. Purpose

VAMS exists to:

- Standardize how VTEX architectures are represented
- Enable deterministic validation of architectures
- Support automated reasoning and rule evaluation
- Reduce ambiguity in solution design
- Enable ecosystem-scale architectural consistency
- Bridge architecture design and implementation guidance

---

## 3. Design Principles

### Deterministic

Identical input must produce identical validation results.

### Structured & Machine‑Readable

Architectures must be parsable and analyzable by systems.

### Graph‑Based

Architectures are modeled as:

- A hierarchical tree of nodes (structure)
- Directed flows between nodes (interaction graph)
- Structured data entities exchanged between systems

### Governance‑Ready

Architectures may include lifecycle metadata (version, status, ownership, validation traceability) and optional e-commerce business context.

---

## 4. Specification Structure

```json
{
  "$schema": "https://raw.githubusercontent.com/miguel-carrera/vams/v1.0.0/schemas/solution-architecture.schema.json",
  "name": "string",
  "level": "Highlevel | Detail | Sequence",
  "domain": "string",
  "metadata": {},
  "architecture": {
    "nodes": [],
    "flows": [],
    "dataEntities": [],
    "environments": [],
    "constraints": {}
  }
}
```

**Required at root:** `$schema`, `name`, `level`, `architecture`.  
**Optional:** `domain`, `metadata`, `metadata.commerce`.

---

## 5. Core Concepts

### Level

| Level     | Description                  |
| --------- | ---------------------------- |
| Highlevel | Project‑level overview       |
| Detail    | Domain‑level architecture    |
| Sequence  | Interaction or flow sequence |

### Metadata

Optional. When present, requires `id`, `version`, `status`, `createdAt`, `createdBy`.

Supports compliance tags, validation baseline, tags, description, and optional **`commerce`** business context.

### Commerce Context (`metadata.commerce`)

Optional. All properties are optional for incremental adoption; add after the structural architecture is defined.

**Conditional rules**

- When `accountType` is `Marketplace`, the schema requires:
  - `marketplace` — nested governance object (see below).
  - `sellerType` — at least one value.
- When `businessModel` is present, it must contain at least one value and duplicate values are not allowed (`minItems: 1`, `uniqueItems`).
- Other array fields that use enums use `uniqueItems` where defined in the schema.

**Legend:** Type `string` / `string[]` with listed values means the value must be one of the schema enums. `integer` and `boolean` are as in JSON. **Required (Marketplace)** marks fields required on `marketplace` when `accountType` is `Marketplace`.

---

#### Business model

| Property        | Type       | Description & values                                                                                                                                           |
| --------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `businessModel` | `string[]` | One or more business models; array allows mixed implementations. If present: min one item, unique values. Values: `B2C`, `B2B`, `B2B2C`, `D2C`, `Marketplace`. |
| `accountType`   | `string`   | VTEX account topology. `Standard` = single merchant. `Marketplace` = operator account and all sellers. Values: `Standard`, `Marketplace`.                      |
| `sellerType`    | `string[]` | Types of sellers present; relevant when `accountType` is `Marketplace`. Unique values. Values: `1P`, `3P`, `Franchise`, `WhiteLabel`.                          |
| `multiAccount`  | `boolean`  | `true` when the implementation spans multiple VTEX accounts (e.g. franchise networks, sub-accounts per region).                                                |

---

#### Marketplace governance (`marketplace`)

Nested object. **Required when `accountType` is `Marketplace`.**

| Property                           | Type     | Description & values                                                                                                     |
| ---------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `marketplace.priceOwnership`       | `string` | **Required (Marketplace).** Who sets the final consumer price. Values: `Marketplace`, `Seller`, `Hybrid`.                |
| `marketplace.paymentOwnership`     | `string` | **Required (Marketplace).** Who processes the payment transaction. Values: `Marketplace`, `Seller`, `Split`.             |
| `marketplace.catalogOwnership`     | `string` | **Required (Marketplace).** Who owns product catalog master data. Values: `Marketplace`, `Seller`, `Shared`.             |
| `marketplace.fulfillmentOwnership` | `string` | **Required (Marketplace).** Who is responsible for order fulfilment logistics. Values: `Marketplace`, `Seller`, `Mixed`. |
| `marketplace.sellerOnboarding`     | `string` | How sellers are onboarded. Values: `Seller Portal`, `API`, `Manual`, `Custom`.                                           |

---

#### Storefront & frontend

| Property        | Type       | Description & values                                                                                                                                               |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `frontend`      | `string`   | Primary storefront technology. Values: `Store Framework`, `FastStore`, `Headless`, `PWA`, `Sales App`, `Embedded`.                                                 |
| `cms`           | `string`   | Content management system. Values: `Site Editor`, `Headless CMS`, `External CMS`, `None`.                                                                          |
| `channels`      | `string[]` | Customer-facing sales and interaction channels. Unique values. Values: `Web`, `Mobile App`, `PWA`, `POS`, `Call Center`, `IoT`, `Conversational`, `Live Shopping`. |
| `cdn`           | `string`   | CDN provider for storefront delivery. Values: `VTEX Native`, `Cloudflare`, `Akamai`, `AWS CloudFront`, `Custom`.                                                   |
| `multiLanguage` | `boolean`  | `true` when serving content in more than one language (catalog translation, CMS localisation).                                                                     |
| `multiCurrency` | `boolean`  | `true` when supporting more than one currency (pricing and checkout implications).                                                                                 |
| `tradePolicies` | `integer`  | Number of VTEX trade policies configured; scaling dimension for multi-region and franchise. Minimum `1` when present.                                              |

---

#### Search & catalog

| Property              | Type      | Description & values                                                                                |
| --------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `searchProvider`      | `string`  | Search and discovery engine. Values: `VTEX Intelligent Search`, `Constructor`, `Algolia`, `Custom`. |
| `catalogSource`       | `string`  | System of record for product catalog data. Values: `VTEX Catalog`, `PIM`, `ERP`, `Hybrid`.          |
| `hasPricePerCustomer` | `boolean` | `true` when customer-specific or contract-based pricing is in use (e.g. B2B price tables, PROS).    |

---

#### Payments & checkout

| Property            | Type       | Description & values                                                                                                                   |
| ------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `paymentMethods`    | `string[]` | Payment methods and gateways; free-form strings.                                                                                       |
| `antiFraud`         | `string`   | Anti-fraud provider with VTEX Payment Hub. Values: `VTEX Native`, `Accertify`, `Riskified`, `Signifyd`, `ClearSale`, `Custom`, `None`. |
| `taxEngine`         | `string`   | Tax calculation provider. Values: `VTEX Native`, `Vertex`, `Avalara`, `Custom`, `None`.                                                |
| `checkoutType`      | `string`   | Checkout implementation model. Values: `VTEX SmartCheckout`, `Headless Checkout`, `Embedded Checkout`, `Custom`.                       |
| `paymentSplitModel` | `string`   | Payment split / intermediation; relevant when `accountType` is `Marketplace`. Values: `None`, `Marketplace-Split`, `External-Split`.   |
| `hasSubscriptions`  | `boolean`  | `true` when VTEX Subscriptions or equivalent recurring order flow exists.                                                              |
| `hasGiftCard`       | `boolean`  | `true` when gift cards (payment or product) are part of the architecture.                                                              |
| `hasLoyalty`        | `boolean`  | `true` when a loyalty or points programme is integrated.                                                                               |
| `hasCustomerCredit` | `boolean`  | `true` when VTEX Customer Credit or charge-account / net-terms flow exists.                                                            |

---

#### Order management & logistics

| Property                 | Type       | Description & values                                                                                                                        |
| ------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `omsProvider`            | `string`   | Order management system; use `External` when VTEX OMS is bypassed. Values: `VTEX OMS`, `Kibo`, `External`, `Custom`.                        |
| `fulfillmentModel`       | `string[]` | Fulfilment strategies covered. Unique values. Values: `Warehouse`, `Ship-from-store`, `Dropship`, `Click-and-collect`, `Same-day-delivery`. |
| `hasReturnsFlow`         | `boolean`  | `true` when a returns flow (VTEX Returns App or custom) exists.                                                                             |
| `multiWarehouse`         | `boolean`  | `true` when inventory spans multiple warehouses or fulfilment centres.                                                                      |
| `hasStorePickup`         | `boolean`  | `true` when click-and-collect / BOPIS is supported.                                                                                         |
| `hasSameDayDelivery`     | `boolean`  | `true` when same-day delivery via a last-mile partner is part of the architecture.                                                          |
| `hasOrderReconciliation` | `boolean`  | `true` when financial order reconciliation exists between marketplace and sellers.                                                          |

---

#### Back-office integrations

| Property           | Type     | Description                                                                                              |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------- |
| `erp`              | `string` | ERP integrated with VTEX; free-form (e.g. SAP, Oracle EBS, Linx).                                        |
| `wms`              | `string` | Warehouse management system (e.g. Korber, custom).                                                       |
| `pim`              | `string` | PIM used as catalog source (e.g. Salsify, Stibo, Akeneo).                                                |
| `crm`              | `string` | CRM for customer data (e.g. Salesforce, Oracle CX).                                                      |
| `identityProvider` | `string` | Identity / SSO alongside VTEX ID. Values: `VTEX ID`, `Azure AD`, `Azure B2C`, `Okta`, `Auth0`, `Custom`. |

---

#### Data & analytics

| Property               | Type       | Description                                                                           |
| ---------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `analyticsProvider`    | `string[]` | Web analytics platforms (e.g. Google Analytics, Adobe Analytics); free-form strings.  |
| `dataWarehouse`        | `string`   | Data warehouse or lakehouse receiving VTEX data (e.g. Snowflake, BigQuery).           |
| `cdpOrPersonalization` | `string[]` | CDP or personalisation tools (e.g. Adobe Target, Criteo, Segment); free-form strings. |
| `hasDataPipeline`      | `boolean`  | `true` when VTEX Data Pipeline is explicitly configured for export.                   |

---

#### Localisation

| Property   | Type       | Description                                                                     |
| ---------- | ---------- | ------------------------------------------------------------------------------- |
| `region`   | `string[]` | ISO 3166-1 alpha-2 country codes; pattern `^[A-Z]{2}$` per item; unique values. |
| `currency` | `string[]` | ISO 4217 currency codes; pattern `^[A-Z]{3}$` per item; unique values.          |
| `language` | `string[]` | BCP 47 language tags (e.g. `en-US`, `pt-BR`, `es-CO`); unique values.           |

**Compliance frameworks** (PCI, GDPR, SOC2, ISO27001, etc.) are **not** fields on `commerce`; they belong on **`metadata.compliance`** per the JSON Schema. See `../schemas/solution-architecture.schema.json` for the allowed enum list.

Canonical definitions, patterns, and conditional logic remain in **`../schemas/solution-architecture.schema.json`**.

### Environments

Required array on `architecture`. Defines runtime environments (`id`, `name`). Nodes may reference an environment by `id`.

### Nodes

Supported node types:

- Group
- Platform
- System
- Application
- Middleware
- Component

Component is the smallest deployable unit and cannot contain children.

Example:

```json
{
  "id": "vtex-platform",
  "name": "VTEX Commerce Platform",
  "type": "Platform"
}
```

---

### Flows

Two types:

**Data Flow**

- origin
- destination
- data

**Event Flow**

- origin
- destination
- event

Example:

```json
{
  "id": "order-sync",
  "type": "Data",
  "origin": "checkout-app",
  "destination": "erp-system",
  "data": ["order"]
}
```

---

### Data Entities

```json
{
  "id": "order",
  "name": "Order",
  "description": "Customer order data",
  "examplePayload": "{ "orderId": "123" }"
}
```

---

### Hierarchy Constraints

Allowed parent → child relationships:

| Parent      | Allowed Children                          |
| ----------- | ----------------------------------------- |
| Group       | Platform, System, Application, Middleware, Component |
| Platform    | Application, Component                    |
| System      | Application, Component                    |
| Application | Component                                 |
| Middleware  | Component                                 |

Component nodes cannot contain other nodes.

---

## 6. Validation Layers

1. **Schema Validation** – structure and required fields
2. **Referential Integrity** – references must exist
3. **Hierarchy Validation** – parent rules and no cycles
4. **Rule Evaluation** – architecture and dependency constraints

---

## 7. Relationship to Atlas

VAMS is the input contract for:

- Architecture Validation Tool
- Application Development Tool
- RFP Technical Analysis
- Support & Knowledge Risk Detection

It enables deterministic validation, explainable reasoning, and architecture guidance.

---

## 8. Versioning Strategy

VAMS schemas use semantic versioning: `MAJOR.MINOR.PATCH` (git tags prefixed with `v`, e.g. `v1.0.0`).

### Schema distribution

- **Canonical owner:** this repository (`miguel-carrera/vams`).
- **Published artifact:** JSON Schema files at immutable GitHub tag URLs:

  `https://raw.githubusercontent.com/miguel-carrera/vams/<tag>/schemas/<schema-file>.json`

- **Consumer rule:** every VAMS document sets `$schema` to a pinned tag URL. Branch URLs (`master`, `main`) are for development only and must not appear in authored documents.
- **Current release:** see `schemas/manifest.json`.

### Version bump rules

| Change | Bump |
| ------ | ---- |
| Add optional field or enum value | MINOR |
| Documentation / non‑breaking schema description fix | PATCH |
| Add required field | MAJOR |
| Remove field | MAJOR |
| Tighten enum (remove value) | MAJOR |
| Change field type or validation constraint in a breaking way | MAJOR |

Published schema versions are never mutated. Fixes ship as a new tag.

### Document vs schema version

- `$schema` — which VAMS JSON Schema version validates the file.
- `metadata.version` (solution architectures) or `version` (architecture cases) — revision of that specific document's content.

---

## 9. Governance Model

Ownership domains:

- Architecture & Delivery Intelligence
- Data & Knowledge Engineering
- Governance

Changes require proposal, impact analysis, compatibility review, and version increment.

---

## 10. Example Use Cases

- Standard B2C VTEX implementation (`metadata.commerce`)
- Marketplace architecture (`accountType`: `Marketplace` + governance)
- Headless commerce
- ERP integration
- OMS integration
- Event‑driven microservices
- Payment gateway orchestration
- Hybrid cloud environments

---

## 11. Roadmap (Future Extensions)

Planned possible extensions:

- Risk scoring model
- Security boundary modeling
- Architecture comparison & drift detection

---

## 12. Why VAMS Matters

**Without VAMS:**

- Architectures are diagrams
- Validation is subjective
- Knowledge is tribal
- Consistency is regional

**With VAMS:**

- Architectures are formal artifacts
- Validation is deterministic
- Expertise is encoded
- Delivery scales safely
- Partners self-validate

VAMS is a foundational layer for ecosystem-scale architectural intelligence.
