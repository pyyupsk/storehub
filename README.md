# @pyyupsk/storehub

TypeScript client for the StoreHub API.

## Install

```bash
npm install @pyyupsk/storehub
```

or

```bash
bun add @pyyupsk/storehub
```

## Quick Start

```ts
import { StoreHubClient } from "@pyyupsk/storehub";

const client = new StoreHubClient({
  storeName: process.env.STOREHUB_STORE_NAME ?? "",
  apiToken: process.env.STOREHUB_API_TOKEN ?? "",
});

const products = await client.getProducts();
const stores = await client.getStores();
```

## Available Methods

- `getProducts()`
- `getProductById(id)`
- `getCustomers(params?)`
- `getCustomerByRefId(refId)`
- `getTransactions(params?)`
- `getInventory(storeId)`
- `getEmployees(params?)`
- `getStores()`
- `getTimesheets(params?)`

## Config

- `storeName` (required)
- `apiToken` (required)
- `baseUrl` (optional, default: `https://api.storehubhq.com`)
- `fetcher` (optional, pass when `fetch` is unavailable)

## Errors

Failed API requests throw `StoreHubApiError` (except `404` lookups that return `null` in `getProductById` and `getCustomerByRefId`).

## Requirements

- Node.js `>=20`

## License

MIT
