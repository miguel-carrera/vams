# VAMS — Commerce Metadata

**commerce** property reference for **metadata.commerce** in solution-architecture.schema.json

*Schema version 1.1.0 · VAMS 1.0 · All properties optional unless noted · ● = required when accountType = Marketplace*

<table style="width:69%;">
<colgroup>
<col style="width: 20%" />
<col style="width: 8%" />
<col style="width: 33%" />
<col style="width: 5%" />
</colgroup>
<thead>
<tr>
<th><strong>Property</strong></th>
<th><strong>Type</strong></th>
<th><strong>Description & Values</strong></th>
<th><strong>Req?</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="4"><strong>Business model</strong></td>
</tr>
<tr>
<td><strong>businessModel</strong></td>
<td><strong>string[]</strong></td>
<td>One or more business models. Array allows mixed B2B + B2C implementations.<br />
B2C · B2B · B2B2C · D2C · Marketplace</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>accountType</strong></td>
<td><strong>string</strong></td>
<td>VTEX account topology. Marketplace covers operator + all its sellers.<br />
Standard · Marketplace</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>sellerType</strong></td>
<td><strong>string[]</strong></td>
<td>Types of sellers present. Relevant when accountType = Marketplace.<br />
1P · 3P · Franchise · WhiteLabel</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>multiAccount</strong></td>
<td><strong>boolean</strong></td>
<td>True when the implementation spans multiple VTEX accounts (franchise networks, sub-accounts per region).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td colspan="4"><strong>Marketplace governance (nested object — required when accountType = Marketplace)</strong></td>
</tr>
<tr>
<td><strong>marketplace.priceOwnership</strong></td>
<td><strong>string</strong></td>
<td>Who sets the final consumer price.<br />
Marketplace · Seller · Hybrid</td>
<td style="text-align: center;">●</td>
</tr>
<tr>
<td><strong>marketplace.paymentOwnership</strong></td>
<td><strong>string</strong></td>
<td>Who processes the payment transaction.<br />
Marketplace · Seller · Split</td>
<td style="text-align: center;">●</td>
</tr>
<tr>
<td><strong>marketplace.catalogOwnership</strong></td>
<td><strong>string</strong></td>
<td>Who owns the product catalog master data.<br />
Marketplace · Seller · Shared</td>
<td style="text-align: center;">●</td>
</tr>
<tr>
<td><strong>marketplace.fulfillmentOwnership</strong></td>
<td><strong>string</strong></td>
<td>Who is responsible for order fulfilment logistics.<br />
Marketplace · Seller · Mixed</td>
<td style="text-align: center;">●</td>
</tr>
<tr>
<td><strong>marketplace.sellerOnboarding</strong></td>
<td><strong>string</strong></td>
<td>How sellers are onboarded onto the marketplace.<br />
Seller Portal · API · Manual · Custom</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td colspan="4"><strong>Storefront & frontend</strong></td>
</tr>
<tr>
<td><strong>frontend</strong></td>
<td><strong>string</strong></td>
<td>Primary storefront technology.<br />
Store Framework · FastStore · Headless · PWA · Sales App · Embedded</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>cms</strong></td>
<td><strong>string</strong></td>
<td>Content management system in use.<br />
Site Editor · Headless CMS · External CMS · None</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>channels</strong></td>
<td><strong>string[]</strong></td>
<td>Customer-facing sales and interaction channels.<br />
Web · Mobile App · PWA · POS · Call Center · IoT · Conversational · Live Shopping</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>cdn</strong></td>
<td><strong>string</strong></td>
<td>CDN provider for storefront delivery.<br />
VTEX Native · Cloudflare · Akamai · AWS CloudFront · Custom</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>multiLanguage</strong></td>
<td><strong>boolean</strong></td>
<td>True when serving content in more than one language. Implies catalog translation and CMS localisation requirements.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>multiCurrency</strong></td>
<td><strong>boolean</strong></td>
<td>True when supporting more than one currency. Implies pricing and checkout currency-switching architecture.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>tradePolicies</strong></td>
<td><strong>integer</strong></td>
<td>Number of VTEX trade policies configured. Key scaling dimension for multi-region and franchise architectures. Minimum: 1.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td colspan="4"><strong>Search & catalog</strong></td>
</tr>
<tr>
<td><strong>searchProvider</strong></td>
<td><strong>string</strong></td>
<td>Search and discovery engine.<br />
VTEX Intelligent Search · Constructor · Algolia · Custom</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>catalogSource</strong></td>
<td><strong>string</strong></td>
<td>System of record for product catalog data.<br />
VTEX Catalog · PIM · ERP · Hybrid</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasPricePerCustomer</strong></td>
<td><strong>boolean</strong></td>
<td>True when customer-specific or contract-based pricing is in use (B2B price tables, PROS, etc.).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td colspan="4"><strong>Payments & checkout</strong></td>
</tr>
<tr>
<td><strong>paymentMethods</strong></td>
<td><strong>string[]</strong></td>
<td>Payment methods and gateways. Free-form strings to accommodate the full vendor landscape.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>antiFraud</strong></td>
<td><strong>string</strong></td>
<td>Anti-fraud provider integrated with VTEX Payment Hub.<br />
VTEX Native · Accertify · Riskified · Signifyd · ClearSale · Custom · None</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>taxEngine</strong></td>
<td><strong>string</strong></td>
<td>Tax calculation provider.<br />
VTEX Native · Vertex · Avalara · Custom · None</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>checkoutType</strong></td>
<td><strong>string</strong></td>
<td>Checkout implementation model.<br />
VTEX SmartCheckout · Headless Checkout · Embedded Checkout · Custom</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>paymentSplitModel</strong></td>
<td><strong>string</strong></td>
<td>Payment split/intermediation model. Relevant when accountType = Marketplace.<br />
None · Marketplace-Split · External-Split</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasSubscriptions</strong></td>
<td><strong>boolean</strong></td>
<td>True when VTEX Subscriptions or equivalent recurring order flow is implemented.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasGiftCard</strong></td>
<td><strong>boolean</strong></td>
<td>True when gift card as a payment method or product is part of the architecture.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasLoyalty</strong></td>
<td><strong>boolean</strong></td>
<td>True when a loyalty or points programme is integrated.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasCustomerCredit</strong></td>
<td><strong>boolean</strong></td>
<td>True when VTEX Customer Credit or charge-account / net-terms payment flow is implemented.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td colspan="4"><strong>Order management & logistics</strong></td>
</tr>
<tr>
<td><strong>omsProvider</strong></td>
<td><strong>string</strong></td>
<td>Order management system. Use External when VTEX OMS is bypassed.<br />
VTEX OMS · Kibo · External · Custom</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>fulfillmentModel</strong></td>
<td><strong>string[]</strong></td>
<td>Fulfilment strategies covered.<br />
Warehouse · Ship-from-store · Dropship · Click-and-collect · Same-day-delivery</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasReturnsFlow</strong></td>
<td><strong>boolean</strong></td>
<td>True when a returns flow (VTEX Returns App or custom) is part of the architecture.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>multiWarehouse</strong></td>
<td><strong>boolean</strong></td>
<td>True when inventory spans multiple warehouses or fulfilment centres.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasStorePickup</strong></td>
<td><strong>boolean</strong></td>
<td>True when click-and-collect / BOPIS is supported.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasSameDayDelivery</strong></td>
<td><strong>boolean</strong></td>
<td>True when same-day delivery via a last-mile partner is part of the architecture.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasOrderReconciliation</strong></td>
<td><strong>boolean</strong></td>
<td>True when a financial order reconciliation flow between marketplace and sellers exists.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td colspan="4"><strong>Back-office integrations</strong></td>
</tr>
<tr>
<td><strong>erp</strong></td>
<td><strong>string</strong></td>
<td>ERP system integrated. Free-form string (e.g. SAP, Oracle EBS, Linx).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>wms</strong></td>
<td><strong>string</strong></td>
<td>Warehouse management system (e.g. Korber, custom).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>pim</strong></td>
<td><strong>string</strong></td>
<td>Product information management system (e.g. Salsify, Stibo, Akeneo).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>crm</strong></td>
<td><strong>string</strong></td>
<td>CRM system integrated for customer data (e.g. Salesforce, Oracle CX).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>identityProvider</strong></td>
<td><strong>string</strong></td>
<td>Identity / SSO provider used alongside VTEX ID.<br />
VTEX ID · Azure AD · Azure B2C · Okta · Auth0 · Custom</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td colspan="4"><strong>Data & analytics</strong></td>
</tr>
<tr>
<td><strong>analyticsProvider</strong></td>
<td><strong>string[]</strong></td>
<td>Web analytics platforms integrated (e.g. Google Analytics, Adobe Analytics).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>dataWarehouse</strong></td>
<td><strong>string</strong></td>
<td>Data warehouse or lakehouse receiving VTEX data (e.g. Snowflake, BigQuery).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>cdpOrPersonalization</strong></td>
<td><strong>string[]</strong></td>
<td>CDP or personalisation tools integrated (e.g. Adobe Target, Criteo, Segment).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>hasDataPipeline</strong></td>
<td><strong>boolean</strong></td>
<td>True when VTEX Data Pipeline is explicitly configured for data export.</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td colspan="4"><strong>Compliance & localisation</strong></td>
</tr>
<tr>
<td><strong>region</strong></td>
<td><strong>string[]</strong></td>
<td>ISO 3166-1 alpha-2 country codes covered. Pattern: ^[A-Z]{2}$</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>currency</strong></td>
<td><strong>string[]</strong></td>
<td>ISO 4217 currency codes supported. Pattern: ^[A-Z]{3}$</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>language</strong></td>
<td><strong>string[]</strong></td>
<td>BCP 47 language tags for supported locales (e.g. en-US, pt-BR, es-CO).</td>
<td style="text-align: center;">—</td>
</tr>
<tr>
<td><strong>compliance</strong></td>
<td><strong>string[]</strong></td>
<td>Applicable compliance and regulatory frameworks.<br />
PCI · GDPR · LGPD · SOC2 · ISO27001</td>
<td style="text-align: center;">—</td>
</tr>
</tbody>
</table>

## Type legend

`string[]` = enum array · `string` = enum · `boolean` · `integer` · Free-form: erp · wms · pim · crm · analyticsProvider · dataWarehouse · cdpOrPersonalization · paymentMethods
