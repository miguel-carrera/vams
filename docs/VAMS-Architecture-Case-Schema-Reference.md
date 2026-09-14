# Architecture Case Metadata

Schema reference for **architecture-case.metadata.schema.json**

*Schema version 1.0.0 · VAMS 1.0 · May 2026*

## Overview

Each architecture case document consists of two files with the same base name:

**case-{slug}.docx or case-{slug}.md** — the human-readable document (.docx or .md), vectorised for RAG retrieval.

**case-{slug}.metadata.json** — this structured metadata sidecar, consumed by Atlas tooling and the RAG pre-filter.

The metadata is divided into seven top-level groups. The commerce block is the only group not reflected in the document — it exists purely as a structured filter signal for the RAG pipeline and Atlas.

## Legend

> **● Required field**
>
> Fields marked with a red dot must be present for the file to pass schema validation.
>
> **◆ Pipeline-managed field**
>
> Fields marked with a purple diamond are written by the RAG ingestion pipeline after vectorisation. They must never be authored manually by SAs.

All other fields are optional but strongly recommended where applicable.

## File naming convention

The **id** field, the base name of the **.docx or .md** document file, and the base name of the **.metadata.json** file must all match. Example:

**case-b2b-split-payment** → **case-b2b-split-payment.docx** + **case-b2b-split-payment.metadata.json**

## 1. Identity & Lifecycle

Top-level fields that identify the case and control its lifecycle state. All are required except lastModifiedAt and lastModifiedBy.

| Property | Req | Type | Description | Allowed values / constraints |
| --- | --- | --- | --- | --- |
| `$schema` | ● | `string` | Pinned VAMS schema URL. Must match the released schema version, e.g. `https://raw.githubusercontent.com/miguel-carrera/vams/v1.0.0/schemas/architecture-case.metadata.schema.json` | const per schema release |
| `id` | ● | `string` | Unique kebab-case identifier. Must start with 'case-' and match the document/json base filename. | Pattern: case-[a-z0-9-]+ |
| `title` | ● | `string` | Human-readable case title. Primary search anchor and display label in Atlas. | 5–120 characters |
| `docxFile` | ● | `string` | Filename of the associated document file (basename only, no path). Must match the id. Accepts .docx or .md. | Pattern: case-[a-z0-9-]+.(docx|md) |
| `version` | ● | `string` | Semantic version. Bump MINOR for content updates, PATCH for corrections. | Pattern: X.Y.Z |
| `status` | ● | `string` | Lifecycle state. Atlas tooling only indexes Approved cases by default. | Draft · Review · Approved · Deprecated |
| `createdAt` | ● | `string` | ISO 8601 creation timestamp. | format: date-time |
| `createdBy` | ● | `string` | Full name or SA alias of the original author. | free-form |
| `lastModifiedAt` |  | `string` | ISO 8601 timestamp of the last edit. | format: date-time |
| `lastModifiedBy` |  | `string` | Name or alias of the last editor. | free-form |

## 2. context

Describes the problem space that motivates the case. These fields drive faceted filtering in Atlas and are also represented as prose in the document for RAG retrieval.

| Property | Req | Type | Description | Allowed values / constraints |
| --- | --- | --- | --- | --- |
| `industry` | ● | `string[]` | Industries the customer operates in. Primary facet filter. | Retail · Wholesale · Fashion & Apparel · Electronics & Technology · Food & Beverage · Healthcare & Pharma · Manufacturing · Financial Services · Telco & Media · Marketplace · Automotive · Home & Garden · Sports & Outdoors · Other |
| `businessModel` | ● | `string[]` | Business models in scope. Array supports mixed models. | B2C · B2B · B2B2C · D2C · Marketplace |
| `region` | ● | `string[]` | ISO 3166-1 alpha-2 country codes relevant to this case. | Pattern: ^[A-Z]{2}$ |
| `customerSize` | ● | `string` | Approximate size of the target customer. Used for scoping and discoverability. | SMB · Mid-Market · Enterprise |
| `summary` | ● | `string` | One-paragraph description of the business problem. Primary full-text search field for this group. | 20–500 characters |
| `painPoints` | ● | `string[]` | Specific pain points the customer faced. One sentence per item. Minimum 1 item. | 5–200 chars per item |
| `constraints` |  | `string[]` | Technical, business, or organisational constraints that shaped the solution. Strongly recommended. | 5–200 chars per item |

## 3. solution

The proposed architectural solution. Captures pattern identity, VTEX products in use, key decisions, and implementation guidance.

| Property | Req | Type | Description | Allowed values / constraints |
| --- | --- | --- | --- | --- |
| `pattern` | ● | `string` | Short name of the architectural pattern applied. Used as facet filter and display label. | 3–100 characters |
| `summary` | ● | `string` | Concise description of what was built, how it works, and why. Primary full-text search field for this group. | 20–600 characters |
| `vtexProducts` | ● | `string[]` | VTEX products and capabilities central to this solution. Free-form to avoid schema churn. | Min 1 item, min 2 chars each |
| `externalIntegrations` |  | `string[]` | Third-party systems or services integrated (ERP, WMS, PIM, PSP, etc.). | free-form |
| `architectureFileRef` |  | `string` | Filename (basename only) of the associated VAMS architecture JSON file, if one exists. | Pattern: [a-z0-9-]+.json |
| `keyDecisions` |  | `object[]` | Most important architectural decisions. Each entry: decision (required), rationale (required), alternativesConsidered (optional). | See architectureDecision object below |
| `implementationComplexity` | ● | `string` | Overall complexity as assessed by the authoring SA. | Low · Medium · High |
| `estimatedTimeline` |  | `string` | Indicative delivery timeline. Free-form, not a commitment. Example: '6–10 weeks'. | Max 50 characters |
| `implementationNotes` |  | `string` | Key gotchas, sequencing advice, or config notes SAs should know before attempting this pattern. | Max 1000 characters |

## 3a. architectureDecision object (item inside solution.keyDecisions[])

Each entry in the keyDecisions array must conform to this structure:

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 2%" />
<col style="width: 9%" />
<col style="width: 47%" />
<col style="width: 20%" />
</colgroup>
<thead>
<tr>
<th><strong>Property</strong></th>
<th></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
<th><strong>Allowed values / constraints</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="5"><strong>architectureDecision (item inside solution.keyDecisions[])</strong></td>
</tr>
<tr>
<td><strong>decision</strong></td>
<td style="text-align: center;">●</td>
<td><strong>string</strong></td>
<td>What was decided. State as a fact, not a question.</td>
<td>5–200 characters</td>
</tr>
<tr>
<td><strong>rationale</strong></td>
<td style="text-align: center;">●</td>
<td><strong>string</strong></td>
<td>Why this decision was made. Include what was traded away.</td>
<td>5–400 characters</td>
</tr>
<tr>
<td><strong>alternativesConsidered</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>Other options evaluated and rejected. One sentence per item.</td>
<td>3–200 chars per item</td>
</tr>
</tbody>
</table>

## 4. tradeoffs

Structured analysis of the solution. Drives both human review and automated scoring in Atlas. Cases with no cons are rejected during the Review stage.

| Property | Req | Type | Description | Allowed values / constraints |
| --- | --- | --- | --- | --- |
| `pros` | ● | `string[]` | Benefits and advantages. Each item must be concrete — not generic. Min 1 item. | 5–300 chars per item |
| `cons` | ● | `string[]` | Drawbacks and limitations. Must be honest — cases with no cons are rejected in review. Min 1 item. | 5–300 chars per item |
| `scores` | ● | `object` | Structured 1–5 scores across 7 dimensions. All 7 keys required. See score table below. | See tradeoffScores table |
| `risks` |  | `object[]` | Known risks. Each entry: risk (required), severity (required), mitigation (optional). See risk object below. | free-form |
| `recommendedWhen` |  | `string[]` | Conditions under which this solution is a good fit. Used by Atlas to surface relevant cases. | 5–300 chars per item |
| `avoidWhen` |  | `string[]` | Conditions under which this solution must NOT be used. Used by Atlas to suppress mismatched cases. | 5–300 chars per item |

## 4a. tradeoffScores — scale reference

All seven score keys are required. Each is an integer from 1 (poor) to 5 (excellent). The table below defines the scale for each key.

| **Score key** | `Range` | **Scale description** |
|----|----|----|
| `implementationCost` | **1 – 5** | 1 = very expensive (heavy dev + licence), 5 = very cheap (native, no overhead) |
| `operationalCost` | **1 – 5** | 1 = high ongoing cost (custom infra, manual ops), 5 = low (fully managed) |
| `scalability` | **1 – 5** | 1 = does not scale (tightly coupled), 5 = scales horizontally with no rework |
| `maintainability` | **1 – 5** | 1 = brittle integrations, hard to upgrade; 5 = native APIs, well-documented |
| `vtexNativeAlignment` | **1 – 5** | 1 = heavily customised or external (high upgrade risk), 5 = fully native VTEX |
| `timeToMarket` | **1 – 5** | 1 = slow (6+ months), 5 = fast (\< 4 weeks) |
| `flexibility` | **1 – 5** | 1 = locks customer into the pattern, 5 = easily adapted or swapped |

## 4b. risk object (item inside tradeoffs.risks\[\])

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 2%" />
<col style="width: 9%" />
<col style="width: 47%" />
<col style="width: 20%" />
</colgroup>
<thead>
<tr>
<th><strong>Property</strong></th>
<th></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
<th><strong>Allowed values / constraints</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="5"><strong>risk (item inside tradeoffs.risks[])</strong></td>
</tr>
<tr>
<td><strong>risk</strong></td>
<td style="text-align: center;">●</td>
<td><strong>string</strong></td>
<td>Description of the risk.</td>
<td>5–200 characters</td>
</tr>
<tr>
<td><strong>severity</strong></td>
<td style="text-align: center;">●</td>
<td><strong>string</strong></td>
<td>Potential impact if the risk materialises.</td>
<td>Low · Medium · High · Critical</td>
</tr>
<tr>
<td><strong>mitigation</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Recommended mitigation strategy. Strongly recommended for High / Critical.</td>
<td>Max 300 characters</td>
</tr>
</tbody>
</table>

## 5. classification

Discoverability and cross-referencing metadata. Used by full-text search, faceted filters, and Atlas case graph. When status = Deprecated, the supersededBy field is required.

| Property | Req | Type | Description | Allowed values / constraints |
| --- | --- | --- | --- | --- |
| `tags` | ● | `string[]` | Free-form keywords for full-text search. Use consistently across the case library. | 2–50 chars per item, min 1 |
| `architecturePattern` |  | `string` | High-level pattern name. Matches solution.pattern unless a more abstract label is needed. | Max 100 characters |
| `vtexLayer` | ● | `string[]` | VTEX platform layers touched by this solution. Primary facet filter in Atlas. Min 1 item. | Storefront · Checkout · Payments · OMS · Catalog · Search · Back-office Integration · Data & Analytics · Identity & Access · Marketplace · Infrastructure |
| `complexity` |  | `string` | Denormalised from solution.implementationComplexity for tooling convenience. Must match. | Low · Medium · High |
| `relatedCases` |  | `string[]` | IDs of other cases related by pattern, domain, or complementarity. | Pattern: case-[a-z0-9-]+ |
| `relatedArchitectures` |  | `string[]` | Filenames (basename only) of VAMS architecture JSON files related to this case. | Pattern: [a-z0-9-]+.json |
| `supersedes` |  | `string` | ID of the older case this one replaces. | Pattern: case-[a-z0-9-]+ |
| `supersededBy` |  | `string` | ID of the newer case that replaces this one. Required when status = Deprecated. | Pattern: case-[a-z0-9-]+ |

## 6. commerce

> **Important**
>
> This block is the pre-filter layer for RAG retrieval. All 43 properties are structured enums, booleans, integers, or free-form strings that a vector search cannot represent or filter on reliably.
>
> The commerce block is NOT reflected in the document. It is the only metadata group that has no prose counterpart.

All commerce properties are optional to support incremental adoption. When accountType = "Marketplace", the nested marketplace governance object becomes required.

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 2%" />
<col style="width: 9%" />
<col style="width: 47%" />
<col style="width: 20%" />
</colgroup>
<thead>
<tr>
<th><strong>Property</strong></th>
<th></th>
<th><strong>Type</strong></th>
<th><strong>Description</strong></th>
<th><strong>Allowed values / constraints</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="5"><strong>Business model</strong></td>
</tr>
<tr>
<td><strong>businessModel</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>One or more business models. Array supports mixed implementations (e.g. B2B + B2C on the same platform).</td>
<td>B2C · B2B · B2B2C · D2C · Marketplace</td>
</tr>
<tr>
<td><strong>accountType</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>VTEX account topology. Marketplace = covers operator + all sellers.</td>
<td>Standard · Marketplace</td>
</tr>
<tr>
<td><strong>sellerType</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>Types of sellers. Only relevant when accountType = Marketplace.</td>
<td>1P · 3P · Franchise · WhiteLabel</td>
</tr>
<tr>
<td><strong>multiAccount</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when implementation spans multiple VTEX accounts.</td>
<td>free-form</td>
</tr>
<tr>
<td colspan="5"><strong>Marketplace governance (nested object — required when accountType = Marketplace)</strong></td>
</tr>
<tr>
<td><strong>marketplace.priceOwnership</strong></td>
<td style="text-align: center;">●</td>
<td><strong>string</strong></td>
<td>Who sets the final consumer price.</td>
<td>Marketplace · Seller · Hybrid</td>
</tr>
<tr>
<td><strong>marketplace.paymentOwnership</strong></td>
<td style="text-align: center;">●</td>
<td><strong>string</strong></td>
<td>Who processes the payment transaction.</td>
<td>Marketplace · Seller · Split</td>
</tr>
<tr>
<td><strong>marketplace.catalogOwnership</strong></td>
<td style="text-align: center;">●</td>
<td><strong>string</strong></td>
<td>Who owns the product catalog master data.</td>
<td>Marketplace · Seller · Shared</td>
</tr>
<tr>
<td><strong>marketplace.fulfillmentOwnership</strong></td>
<td style="text-align: center;">●</td>
<td><strong>string</strong></td>
<td>Who is responsible for order fulfilment logistics.</td>
<td>Marketplace · Seller · Mixed</td>
</tr>
<tr>
<td><strong>marketplace.sellerOnboarding</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>How sellers are onboarded.</td>
<td>Seller Portal · API · Manual · Custom</td>
</tr>
<tr>
<td colspan="5"><strong>Storefront &amp; frontend</strong></td>
</tr>
<tr>
<td><strong>frontend</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Primary storefront technology.</td>
<td>Store Framework · FastStore · Headless · PWA · Sales App · Embedded</td>
</tr>
<tr>
<td><strong>cms</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Content management system in use.</td>
<td>Site Editor · Headless CMS · External CMS · None</td>
</tr>
<tr>
<td><strong>channels</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>Customer-facing sales and interaction channels.</td>
<td>Web · Mobile App · PWA · POS · Call Center · IoT · Conversational · Live Shopping</td>
</tr>
<tr>
<td><strong>cdn</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>CDN provider for storefront delivery.</td>
<td>VTEX Native · Cloudflare · Akamai · AWS CloudFront · Custom</td>
</tr>
<tr>
<td><strong>multiLanguage</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when serving content in more than one language.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>multiCurrency</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when supporting more than one currency.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>tradePolicies</strong></td>
<td style="text-align: center;"></td>
<td><strong>integer</strong></td>
<td>Number of VTEX trade policies configured. Minimum: 1.</td>
<td>Min: 1</td>
</tr>
<tr>
<td colspan="5"><strong>Search &amp; catalog</strong></td>
</tr>
<tr>
<td><strong>searchProvider</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Search and discovery engine.</td>
<td>VTEX Intelligent Search · Constructor · Algolia · Custom</td>
</tr>
<tr>
<td><strong>catalogSource</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>System of record for product catalog data.</td>
<td>VTEX Catalog · PIM · ERP · Hybrid</td>
</tr>
<tr>
<td><strong>hasPricePerCustomer</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when customer-specific pricing is in use (B2B price tables, PROS, etc.).</td>
<td>free-form</td>
</tr>
<tr>
<td colspan="5"><strong>Payments &amp; checkout</strong></td>
</tr>
<tr>
<td><strong>paymentMethods</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>Payment methods and gateways. Free-form to accommodate the full vendor landscape.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>antiFraud</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Anti-fraud provider integrated with VTEX Payment Hub.</td>
<td>VTEX Native · Accertify · Riskified · Signifyd · ClearSale · Custom · None</td>
</tr>
<tr>
<td><strong>taxEngine</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Tax calculation provider.</td>
<td>VTEX Native · Vertex · Avalara · Custom · None</td>
</tr>
<tr>
<td><strong>checkoutType</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Checkout implementation model.</td>
<td>VTEX SmartCheckout · Headless Checkout · Embedded Checkout · Custom</td>
</tr>
<tr>
<td><strong>paymentSplitModel</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Payment split model. Only relevant when accountType = Marketplace.</td>
<td>None · Marketplace-Split · External-Split</td>
</tr>
<tr>
<td><strong>hasSubscriptions</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when recurring order flow is implemented.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>hasGiftCard</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when gift card as payment method or product is in scope.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>hasLoyalty</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when a loyalty / points programme is integrated.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>hasCustomerCredit</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when VTEX Customer Credit or net-terms payment flow is implemented.</td>
<td>free-form</td>
</tr>
<tr>
<td colspan="5"><strong>Order management &amp; logistics</strong></td>
</tr>
<tr>
<td><strong>omsProvider</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Order management system.</td>
<td>VTEX OMS · Kibo · External · Custom</td>
</tr>
<tr>
<td><strong>fulfillmentModel</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>Fulfilment strategies covered.</td>
<td>Warehouse · Ship-from-store · Dropship · Click-and-collect · Same-day-delivery</td>
</tr>
<tr>
<td><strong>hasReturnsFlow</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when a returns flow is part of the architecture.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>multiWarehouse</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when inventory spans multiple warehouses.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>hasStorePickup</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when click-and-collect / BOPIS is supported.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>hasSameDayDelivery</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when same-day delivery via a last-mile partner is in scope.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>hasOrderReconciliation</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when a financial reconciliation flow between marketplace and sellers exists.</td>
<td>free-form</td>
</tr>
<tr>
<td colspan="5"><strong>Back-office integrations</strong></td>
</tr>
<tr>
<td><strong>erp</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>ERP system integrated (e.g. SAP, Oracle EBS, Linx). Free-form.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>wms</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Warehouse management system (e.g. Korber). Free-form.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>pim</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Product information management system (e.g. Salsify, Stibo). Free-form.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>crm</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>CRM system integrated for customer data (e.g. Salesforce). Free-form.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>identityProvider</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Identity / SSO provider used alongside VTEX ID.</td>
<td>VTEX ID · Azure AD · Azure B2C · Okta · Auth0 · Custom</td>
</tr>
<tr>
<td colspan="5"><strong>Data &amp; analytics</strong></td>
</tr>
<tr>
<td><strong>analyticsProvider</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>Web analytics platforms integrated. Free-form.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>dataWarehouse</strong></td>
<td style="text-align: center;"></td>
<td><strong>string</strong></td>
<td>Data warehouse or lakehouse (e.g. Snowflake, BigQuery). Free-form.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>cdpOrPersonalization</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>CDP or personalisation tools (e.g. Adobe Target, Criteo). Free-form.</td>
<td>free-form</td>
</tr>
<tr>
<td><strong>hasDataPipeline</strong></td>
<td style="text-align: center;"></td>
<td><strong>boolean</strong></td>
<td>True when VTEX Data Pipeline is explicitly configured for data export.</td>
<td>free-form</td>
</tr>
<tr>
<td colspan="5"><strong>Localisation</strong></td>
</tr>
<tr>
<td><strong>region</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>ISO 3166-1 alpha-2 country codes covered.</td>
<td>Pattern: ^[A-Z]{2}$</td>
</tr>
<tr>
<td><strong>currency</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>ISO 4217 currency codes supported.</td>
<td>Pattern: ^[A-Z]{3}$</td>
</tr>
<tr>
<td><strong>language</strong></td>
<td style="text-align: center;"></td>
<td><strong>string[]</strong></td>
<td>BCP 47 language tags (e.g. en-US, pt-BR, es-CO).</td>
<td>free-form</td>
</tr>
</tbody>
</table>

## 7. vectorStore

> **Pipeline-managed**
>
> This block is written exclusively by the RAG ingestion pipeline after a successful vectorisation run. SAs must never author or edit this block manually.
>
> The block is absent when a case is first created and only appears after the first successful ingestion run.

The chunkIds map links each document section to its vector store ID, enabling targeted re-ingestion when only part of a document changes.

| Property | Req | Type | Description | Allowed values / constraints |
| --- | --- | --- | --- | --- |
| `indexedAt` | ● | `string` | Timestamp of the last successful vectorisation run. | format: date-time |
| `chunkIds.context` | ● | `string` | Vector store ID for the Context section chunk. | free-form |
| `chunkIds.solution` | ● | `string` | Vector store ID for the Proposed Solution section chunk. | free-form |
| `chunkIds.tradeoffs` | ● | `string` | Vector store ID for the Trade-off Analysis section chunk. | free-form |
| `chunkIds.relatedCases` | ◆ | `string` | Vector store ID for the Related Cases section chunk. Only present if the section exists in the document. | free-form |

## 8. Blank skeleton

Copy and complete this skeleton to create a new case metadata file. Replace all placeholder values. The `docxFile` field accepts `.docx` or `.md`. The `vectorStore` block is omitted — it will be added by the ingestion pipeline.

```json
{
  "$schema": "https://raw.githubusercontent.com/miguel-carrera/vams/v1.0.0/schemas/architecture-case.metadata.schema.json",
  "id": "case-{slug}",
  "title": "",
  "docxFile": "case-{slug}.docx",
  "version": "1.0.0",
  "status": "Draft",
  "createdAt": "",
  "createdBy": "",

  "context": {
    "industry": [],
    "businessModel": [],
    "region": [],
    "customerSize": "",
    "summary": "",
    "painPoints": [],
    "constraints": []
  },

  "solution": {
    "pattern": "",
    "summary": "",
    "vtexProducts": [],
    "externalIntegrations": [],
    "architectureFileRef": "",
    "keyDecisions": [
      { "decision": "", "rationale": "", "alternativesConsidered": [] }
    ],
    "implementationComplexity": "",
    "estimatedTimeline": "",
    "implementationNotes": ""
  },

  "tradeoffs": {
    "pros": [],
    "cons": [],
    "scores": {
      "implementationCost": null,
      "operationalCost": null,
      "scalability": null,
      "maintainability": null,
      "vtexNativeAlignment": null,
      "timeToMarket": null,
      "flexibility": null
    },
    "risks": [
      { "risk": "", "severity": "", "mitigation": "" }
    ],
    "recommendedWhen": [],
    "avoidWhen": []
  },

  "classification": {
    "tags": [],
    "architecturePattern": "",
    "vtexLayer": [],
    "complexity": "",
    "relatedCases": [],
    "relatedArchitectures": []
  },

  "commerce": {
    "businessModel": [],
    "accountType": "",
    "frontend": "",
    "channels": [],
    "searchProvider": "",
    "paymentMethods": [],
    "checkoutType": "",
    "omsProvider": "",
    "fulfillmentModel": [],
    "erp": "",
    "region": [],
    "currency": [],
    "language": []
  }
}
```
