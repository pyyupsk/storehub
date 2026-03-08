# Resources

Resources provide access to StoreHub API endpoints. Each resource corresponds to a REST entity.

## ProductResource

Manage products in your StoreHub store.

### Methods

#### `list()`

Fetch all products.

```typescript
const products = await client.product.list();
```

**Returns:** `Promise<Product[]>`

#### `getById(id)`

Fetch a product by ID.

```typescript
const product = await client.product.getById("65af8a5f36eca30006e926f8");
```

**Parameters:**

- `id` - Product ID

**Returns:** `Promise<Product | null>` - Returns `null` if not found

---

## CustomerResource

Manage customers in your StoreHub store.

### Methods

#### `list(params?)`

Fetch customers with optional filters.

```typescript
// Get all customers
const customers = await client.customer.list();

// Filter by first name
const customers = await client.customer.list({ firstName: "John" });

// Filter by phone
const customers = await client.customer.list({ phone: "0815494024" });

// Multiple filters (AND logic)
const customers = await client.customer.list({
  firstName: "John",
  phone: "0815494024",
});
```

**Parameters:**

- `params` (optional) - Filter parameters:
  - `firstName` - Filter by first name (begins with)
  - `lastName` - Filter by last name (begins with)
  - `email` - Filter by email (contains)
  - `phone` - Filter by phone (contains)

**Returns:** `Promise<Customer[]>`

#### `getByRefId(refId)`

Fetch a customer by reference ID.

```typescript
const customer = await client.customer.getByRefId(
  "9bb4e822-92bd-4228-b958-69474c71cae8"
);
```

**Parameters:**

- `refId` - Customer reference ID

**Returns:** `Promise<Customer | null>` - Returns `null` if not found

---

## TransactionResource

Manage transactions in your StoreHub store.

### Methods

#### `list(params?)`

Fetch transactions with optional filters.

```typescript
// Get all transactions
const transactions = await client.transaction.list();

// Filter by date range
const transactions = await client.transaction.list({
  startDate: "2024-01-01",
  endDate: "2024-12-31",
});
```

**Parameters:**

- `params` (optional) - Filter parameters (see StoreHub API for available query params)

**Returns:** `Promise<Transaction[]>`

---

## InventoryResource

Manage inventory/stock levels in your StoreHub store.

### Methods

#### `getByStoreId(storeId)`

Fetch inventory for a specific store.

```typescript
const inventory = await client.inventory.getByStoreId(
  "62985f67dd07e0000714ef5c"
);
```

**Parameters:**

- `storeId` - Store ID

**Returns:** `Promise<Stock[]>`

---

## EmployeeResource

Manage employees in your StoreHub store.

### Methods

#### `list(params?)`

Fetch employees with optional filters.

```typescript
// Get all employees
const employees = await client.employee.list();

// Filter by modification date
const employees = await client.employee.list({
  modifiedSince: new Date("2024-01-01"),
});
```

**Parameters:**

- `params` (optional) - Filter parameters:
  - `modifiedSince` - Only return employees modified since this date

**Returns:** `Promise<Employee[]>`

---

## StoreResource

Manage stores in your StoreHub account.

### Methods

#### `list()`

Fetch all stores.

```typescript
const stores = await client.store.list();
```

**Returns:** `Promise<Store[]>`

---

## TimesheetResource

Manage employee timesheets.

### Methods

#### `list(params?)`

Fetch timesheets with optional filters.

```typescript
// Get all timesheets
const timesheets = await client.timesheet.list();

// Filter by store
const timesheets = await client.timesheet.list({
  storeId: "62985f67dd07e0000714ef5c",
});

// Filter by employee
const timesheets = await client.timesheet.list({
  employeeId: "62985f67dd07e0000714f028",
});

// Filter by date range
const timesheets = await client.timesheet.list({
  from: new Date("2024-01-01"),
  to: new Date("2024-12-31"),
});
```

**Parameters:**

- `params` (optional) - Filter parameters:
  - `storeId` - Filter by store ID
  - `employeeId` - Filter by employee ID
  - `from` - Clock in after this time
  - `to` - Clock in before this time

**Returns:** `Promise<Timesheet[]>`
