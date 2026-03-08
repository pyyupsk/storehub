# @pyyupsk/storehub

> **Unofficial** TypeScript client for the StoreHub POS API. Built with ❤️ for better developer experience.

[![npm version](https://img.shields.io/npm/v/@pyyupsk/storehub.svg)](https://www.npmjs.com/package/@pyyupsk/storehub)
[![npm downloads](https://img.shields.io/npm/dm/@pyyupsk/storehub.svg)](https://www.npmjs.com/package/@pyyupsk/storehub)
[![License](https://img.shields.io/npm/l/@pyyupsk/storehub.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## Features

- 🛍️ **Complete API Coverage** - Products, Customers, Transactions, Inventory, Employees, Stores, Timesheets
- 🔒 **Type-Safe** - Full TypeScript types for all API responses
- 🚀 **Modern** - Dual ESM/CJS output, tree-shakeable
- 🎯 **Easy to Use** - Simple, intuitive API
- 🧪 **Tested** - Verified against real StoreHub API responses
- 📦 **Lightweight** - No heavy dependencies

---

## Installation

```bash
npm install @pyyupsk/storehub
```

or with Bun:

```bash
bun add @pyyupsk/storehub
```

---

## Quick Start

### 1. Get Your API Credentials

You need:

- **Store Name** - Your store subdomain (e.g., `lingkythailand` from `lingkythailand.storehubhq.com`)
- **API Token** - Contact your StoreHub sales representative

### 2. Configure Environment Variables

```bash
STOREHUB_USERNAME=your_store_name
STOREHUB_API_TOKEN=your_api_token
STOREHUB_STORE_ID=your_store_id
```

### 3. Create a Client

```typescript
import { StoreHubClient } from "@pyyupsk/storehub";

const client = new StoreHubClient({
  storeName: process.env.STOREHUB_USERNAME ?? "",
  apiToken: process.env.STOREHUB_API_TOKEN ?? "",
});
```

### 4. Make Requests

```typescript
// Fetch all products
const products = await client.getProducts();
console.log(`Found ${products.length} products`);

// Fetch customers with filters
const customers = await client.getCustomers({ firstName: "John" });

// Get a specific product (returns null if not found)
const product = await client.getProductById("65af8a5f36eca30006e926f8");

// Get inventory for a store
const inventory = await client.getInventory("62985f67dd07e0000714ef5c");
```

---

## API Reference

### Products

```typescript
// Get all products
const products = await client.getProducts();

// Get product by ID
const product = await client.getProductById("product-id");
// Returns: Product | null
```

### Customers

```typescript
// Get all customers
const customers = await client.getCustomers();

// Search customers
const customers = await client.getCustomers({
  firstName: "John",
  phone: "0815494024",
});

// Get customer by refId
const customer = await client.getCustomerByRefId("customer-ref-id");
// Returns: Customer | null
```

### Transactions

```typescript
// Get all transactions
const transactions = await client.getTransactions();

// Filter transactions
const transactions = await client.getTransactions({
  startDate: "2024-01-01",
  endDate: "2024-12-31",
});
```

### Inventory

```typescript
// Get inventory by store ID
const inventory = await client.getInventory("store-id");
```

### Employees

```typescript
// Get all employees
const employees = await client.getEmployees();

// Filter by modification date
const employees = await client.getEmployees({
  modifiedSince: new Date("2024-01-01"),
});
```

### Stores

```typescript
// Get all stores
const stores = await client.getStores();
```

### Timesheets

```typescript
// Get all timesheets
const timesheets = await client.getTimesheets();

// Filter timesheets
const timesheets = await client.getTimesheets({
  storeId: "store-id",
  employeeId: "employee-id",
  from: new Date("2024-01-01"),
  to: new Date("2024-12-31"),
});
```

---

## Configuration

| Property    | Type     | Required | Default                      | Description                 |
| ----------- | -------- | -------- | ---------------------------- | --------------------------- |
| `storeName` | `string` | Yes      | -                            | Your store name (subdomain) |
| `apiToken`  | `string` | Yes      | -                            | Your API token              |
| `baseUrl`   | `string` | No       | `https://api.storehubhq.com` | Custom API base URL         |
| `fetcher`   | `Fetch`  | No       | `globalThis.fetch`           | Custom fetch implementation |

### Custom Fetch Example

```typescript
import { StoreHubClient } from "@pyyupsk/storehub";
import fetch from "node-fetch";

const client = new StoreHubClient({
  storeName: "my-store",
  apiToken: "my-token",
  fetcher: fetch, // Use node-fetch for Node.js < 18
});
```

---

## Error Handling

### StoreHubApiError

All API errors throw `StoreHubApiError`:

```typescript
import { StoreHubApiError } from "@pyyupsk/storehub";

try {
  const products = await client.getProducts();
} catch (error) {
  if (error instanceof StoreHubApiError) {
    console.error(`Status: ${error.status}`);
    console.error(`URL: ${error.url}`);
    console.error(`Response: ${error.responseBody}`);
  }
}
```

### 404 Handling

Lookup methods return `null` for 404 responses:

```typescript
const product = await client.getProductById("non-existent-id");
if (product === null) {
  console.log("Product not found");
}
```

---

## Type Definitions

All types are exported for your use:

```typescript
import type {
  Product,
  Customer,
  Transaction,
  Stock,
  Employee,
  Store,
  Timesheet,
} from "@pyyupsk/storehub";
```

See [Type Definitions](https://pyyupsk.github.io/storehub/api/types.html) for complete type reference.

---

## Rate Limiting

StoreHub applies rate limiting at **3 calls per second**. If exceeded, you'll receive an error response. Contact StoreHub support if your account is rate limited.

---

## Requirements

- Node.js `>=20`
- TypeScript `>=5.0` (for type checking)

---

## Development

```bash
# Install dependencies
bun install

# Build the package
bun run build

# Run tests
bun run test

# Type check
bun run typecheck

# Lint
bun run lint
```

---

## Documentation

Full documentation is available at: [pyyupsk.github.io/storehub](https://pyyupsk.github.io/storehub)

- [Getting Started](https://pyyupsk.github.io/storehub/getting-started.html)
- [API Reference](https://pyyupsk.github.io/storehub/api/client.html)
- [Type Definitions](https://pyyupsk.github.io/storehub/api/types.html)

---

## Disclaimer

⚠️ **This is an unofficial community-built library and is not affiliated with or endorsed by StoreHub.**

All API documentation is based on reverse-engineering the StoreHub API. For official API documentation, contact StoreHub support.

---

## License

[MIT](LICENSE)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Acknowledgments

- Built with love for the StoreHub community
- API documentation based on StoreHub's REST API
