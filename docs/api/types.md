# Type Definitions

All TypeScript types exported by `@pyyupsk/storehub`.

## Product Types

### `Product`

```typescript
interface Product {
  id: string;
  name: string;
  category?: string;
  priceType: PriceType;
  unitPrice?: number;
  cost?: number | null;
  barcode?: string;
  trackStockLevel: boolean;
  isParentProduct: boolean;
  variantGroups?: VariantGroup[];
  parentProductId?: string;
  variationValues?: VariationValue[];
  sku?: string;
}
```

### `PriceType`

```typescript
type PriceType = "Fixed" | "Variable";
```

### `VariantGroup`

```typescript
interface VariantGroup {
  id: string;
  name: string;
  options: VariantGroupOption[];
}
```

### `VariantGroupOption`

```typescript
interface VariantGroupOption {
  id: string;
  optionValue: string;
  priceDifference: number;
  isDefault?: boolean;
}
```

### `VariationValue`

```typescript
interface VariationValue {
  variantGroupId: string;
  value: string;
}
```

---

## Customer Types

### `Customer`

```typescript
interface Customer {
  refId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  createdTime: string;
  modifiedTime: string;
  tags: CustomerTag[];
  birthday: null;
  state?: string;
  loyalty?: number;
}
```

### `CustomerTag`

```typescript
type CustomerTag = "" | "ปลีก" | "ราคาส่ง 1" | "ราคาส่ง 2";
```

### `CustomerSearchParams`

```typescript
interface CustomerSearchParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}
```

---

## Transaction Types

### `Transaction`

```typescript
interface Transaction {
  refId: string;
  invoiceNumber: string;
  storeId: string;
  registerId: string;
  employeeId: string;
  transactionType: "Sale" | "Return";
  transactionTime: string;
  total: number;
  subTotal: number;
  tax: number;
  discount: number;
  tableId: null | string;
  roundedAmount: number;
  serviceCharge: number;
  seniorDiscount: number;
  pwdDiscount: number;
  athleteAndCoachDiscount: number;
  medalOfValorDiscount: number;
  soloParentDiscount: number;
  isMemcApplied: boolean;
  promotions: TransactionPromotion[];
  items: TransactionItem[];
  payments: TransactionPayment[];
  isCancelled: boolean;
  terminalNumber: number;
  channel: string;
  customerRefId?: string;
  cancelledTime?: string;
  cancelledBy?: string;
  returnReason?: string;
  saleInvoiceNumber?: string;
}
```

### `TransactionItem`

```typescript
interface TransactionItem {
  productId: string;
  quantity: number;
  total: number;
  subTotal: number;
  tax?: number;
  taxCode: string;
  discount: number;
  unitPrice?: number;
  itemType: string;
  notes: string;
  deductedTax: number;
  promotions: unknown[];
  selectedOptions?: TransactionSelectedOption[];
}
```

### `TransactionPayment`

```typescript
interface TransactionPayment {
  paymentMethod: string;
  amount: number;
}
```

### `TransactionPromotion`

```typescript
interface TransactionPromotion {
  id: string;
  name: string;
  discount: number;
  tax: number;
}
```

### `TransactionSelectedOption`

```typescript
interface TransactionSelectedOption {
  groupId: string;
  optionId: string;
  optionValue: string;
  quantity: number;
}
```

### `TransactionSearchParams`

```typescript
type TransactionSearchParams = QueryParams;
```

---

## Inventory Types

### `Stock`

```typescript
interface Stock {
  productId: string;
  quantityOnHand: number;
  warningStock?: number;
}
```

---

## Employee Types

### `Employee`

```typescript
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdTime: string;
  modifiedTime: string;
}
```

### `EmployeeSearchParams`

```typescript
interface EmployeeSearchParams {
  modifiedSince?: string | Date;
}
```

---

## Store Types

### `Store`

```typescript
interface Store {
  id: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
}
```

---

## Timesheet Types

### `Timesheet`

```typescript
interface Timesheet {
  employeeId: string;
  storeId: string;
  clockInTime: string;
  clockOutTime: string;
}
```

### `TimesheetSearchParams`

```typescript
interface TimesheetSearchParams {
  storeId?: string;
  employeeId?: string;
  from?: string | Date;
  to?: string | Date;
}
```

---

## Core Types

### `StoreHubClientConfig`

```typescript
interface StoreHubClientConfig {
  storeName: string;
  apiToken: string;
  baseUrl?: string;
  fetcher?: FetchLike;
}
```

### `StoreHubApiError`

```typescript
class StoreHubApiError extends Error {
  status: number;
  url: string;
  responseBody: string | undefined;
}
```

### `QueryParams`

```typescript
type QueryParams = Record<string, PrimitiveQueryValue>;

type PrimitiveQueryValue = string | number | boolean | Date | null | undefined;
```
