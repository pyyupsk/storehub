# Getting Started

::: warning Disclaimer
This is an **unofficial** community-built library and is not affiliated with or endorsed by StoreHub. All API documentation is based on reverse-engineering the StoreHub API.
:::

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- A StoreHub account with API access

## Installation

Install the package from npm:

```bash
npm install @pyyupsk/storehub
```

or with Bun:

```bash
bun add @pyyupsk/storehub
```

## Quick Start

### 1. Get Your API Credentials

You need two pieces of information from StoreHub:

1. **Store Name** - Your store subdomain (e.g., `your-store` from `your-store.storehubhq.com`)
2. **API Token** - Auto-generated for your account

> **Note:** Contact your StoreHub sales representative to receive your API token.

### 2. Configure Environment Variables

Set up your credentials as environment variables:

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

### 4. Make Your First Request

```typescript
// Fetch all products
const products = await client.getProducts();
console.log(`Found ${products.length} products`);

// Fetch all stores
const stores = await client.getStores();
console.log(`Found ${stores.length} stores`);
```

## Basic Usage

### Fetching Data

```typescript
import { StoreHubClient } from "@pyyupsk/storehub";

const client = new StoreHubClient({
  storeName: "your-store",
  apiToken: "your-token",
});

// Get all products
const products = await client.getProducts();

// Get a specific product by ID
const product = await client.getProductById("product-id");

// Get customers with filters
const customers = await client.getCustomers({ firstName: "John" });

// Get transactions
const transactions = await client.getTransactions();

// Get inventory for a store
const inventory = await client.getInventory("your-store-id");

// Get employees
const employees = await client.getEmployees();

// Get all stores
const stores = await client.getStores();

// Get timesheets with filters
const timesheets = await client.getTimesheets({
  storeId: "your-store-id",
});
```

### Error Handling

The client throws `StoreHubApiError` for failed requests:

```typescript
import { StoreHubClient, StoreHubApiError } from "@pyyupsk/storehub";

const client = new StoreHubClient({
  storeName: "your-store",
  apiToken: "your-token",
});

try {
  const products = await client.getProducts();
} catch (error) {
  if (error instanceof StoreHubApiError) {
    console.error(`API Error: ${error.status} - ${error.message}`);
    console.error(`URL: ${error.url}`);
    console.error(`Response: ${error.responseBody}`);
  }
}
```

### 404 Handling

Lookup methods return `null` when a resource is not found:

```typescript
const product = await client.getProductById("non-existent-id");
if (product === null) {
  console.log("Product not found");
}
```

## Next Steps

- [API Reference](/api/client) - Learn about all available methods
- [Resources](/api/resources) - Detailed documentation for each resource
- [Types](/api/types) - TypeScript type definitions
