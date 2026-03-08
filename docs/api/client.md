# StoreHubClient

The `StoreHubClient` is the main entry point for interacting with the StoreHub API. It provides a simple, type-safe interface for all StoreHub resources.

::: warning
This is an **unofficial** community-built library and is not affiliated with or endorsed by StoreHub.
:::

## Constructor

```typescript
import { StoreHubClient } from "@pyyupsk/storehub";

const client = new StoreHubClient(config: StoreHubClientConfig);
```

### Configuration

| Property    | Type     | Required | Default                      | Description                                    |
| ----------- | -------- | -------- | ---------------------------- | ---------------------------------------------- |
| `storeName` | `string` | Yes      | -                            | Your store name (subdomain)                    |
| `apiToken`  | `string` | Yes      | -                            | Your API token                                 |
| `baseUrl`   | `string` | No       | `https://api.storehubhq.com` | Custom API base URL                            |
| `fetcher`   | `Fetch`  | No       | `globalThis.fetch`           | Custom fetch implementation (for Node.js < 18) |

### Example

```typescript
const client = new StoreHubClient({
  storeName: "your-store",
  apiToken: "your-api-token",
});
```

## Convenience Methods

The `StoreHubClient` provides convenience methods that delegate to resource clients:

### Product Methods

```typescript
// Get all products
const products = await client.getProducts();

// Get a product by ID (returns null if not found)
const product = await client.getProductById("product-id");
```

### Customer Methods

```typescript
// Get all customers
const customers = await client.getCustomers();

// Get customers with filters
const customers = await client.getCustomers({ firstName: "John" });

// Get a customer by refId (returns null if not found)
const customer = await client.getCustomerByRefId("customer-ref-id");
```

### Transaction Methods

```typescript
// Get all transactions
const transactions = await client.getTransactions();

// Get transactions with filters
const transactions = await client.getTransactions({
  startDate: "2024-01-01",
  endDate: "2024-12-31",
});
```

### Inventory Methods

```typescript
// Get inventory for a specific store
const inventory = await client.getInventory("your-store-id");
```

### Employee Methods

```typescript
// Get all employees
const employees = await client.getEmployees();

// Get employees modified since a date
const employees = await client.getEmployees({
  modifiedSince: new Date("2024-01-01"),
});
```

### Store Methods

```typescript
// Get all stores
const stores = await client.getStores();
```

### Timesheet Methods

```typescript
// Get all timesheets
const timesheets = await client.getTimesheets();

// Get timesheets with filters
const timesheets = await client.getTimesheets({
  storeId: "your-store-id",
  employeeId: "your-employee-id",
  from: new Date("2024-01-01"),
  to: new Date("2024-12-31"),
});
```

## Resource Clients

For more granular control, you can use the resource clients directly:

```typescript
// Access resource clients
client.product; // ProductResource
client.customer; // CustomerResource
client.transaction; // TransactionResource
client.inventory; // InventoryResource
client.employee; // EmployeeResource
client.store; // StoreResource
client.timesheet; // TimesheetResource
```

See [Resources](/api/resources) for detailed documentation on each resource.

## Error Handling

### StoreHubApiError

All API errors throw `StoreHubApiError`:

```typescript
import { StoreHubApiError } from "@pyyupsk/storehub";

try {
  await client.getProducts();
} catch (error) {
  if (error instanceof StoreHubApiError) {
    console.error(error.status); // HTTP status code
    console.error(error.url); // Request URL
    console.error(error.responseBody); // Raw response body
  }
}
```

### 404 Handling

Lookup methods return `null` for 404 responses:

```typescript
const product = await client.getProductById("non-existent");
if (product === null) {
  // Product not found
}
```

## Rate Limiting

StoreHub applies rate limiting at **3 calls per second**. If exceeded, you'll receive an error response. Contact StoreHub support if your account is rate limited.

## Authentication

All requests use Basic Authentication with your `storeName:apiToken` credentials. The client handles encoding automatically.
