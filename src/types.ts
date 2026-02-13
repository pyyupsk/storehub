export type PriceType = "Fixed" | "Variable";

export interface VariantGroupOption {
  id: string;
  optionValue: string;
  priceDifference: number;
  isDefault?: boolean;
}

export interface VariantGroup {
  id: string;
  name: string;
  options: VariantGroupOption[];
}

export interface VariationValue {
  variantGroupId: string;
  value: string;
}

export interface Product {
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

export type CustomerTag = "" | "ปลีก" | "ราคาส่ง 1" | "ราคาส่ง 2";

export interface Customer {
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

export interface Stock {
  productId: string;
  quantityOnHand: number;
  warningStock?: number;
}

export interface Transaction {
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

export interface TransactionPromotion {
  id: string;
  name: string;
  discount: number;
  tax: number;
}

export interface TransactionSelectedOption {
  groupId: string;
  optionId: string;
  optionValue: string;
  quantity: number;
}

export interface TransactionItem {
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
  promotions: unknown[];
  selectedOptions?: TransactionSelectedOption[];
}

export interface TransactionPayment {
  paymentMethod: string;
  amount: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdTime: string;
  modifiedTime: string;
}

export interface Store {
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

export interface Timesheet {
  employeeId: string;
  storeId: string;
  clockInTime: string;
  clockOutTime: string;
}

export type PrimitiveQueryValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export type QueryParams = Record<string, PrimitiveQueryValue>;

export interface CustomerSearchParams {
  [key: string]: PrimitiveQueryValue;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface EmployeeSearchParams {
  [key: string]: PrimitiveQueryValue;
  modifiedSince?: string | Date;
}

export interface TimesheetSearchParams {
  [key: string]: PrimitiveQueryValue;
  storeId?: string;
  employeeId?: string;
  from?: string | Date;
  to?: string | Date;
}

export interface FetchRequestInitLike {
  method?: string;
  headers?: Record<string, string>;
}

export interface FetchResponseLike {
  readonly ok: boolean;
  readonly status: number;
  json(): Promise<unknown>;
  text(): Promise<string>;
}

export type FetchLike = (
  input: string,
  init?: FetchRequestInitLike
) => Promise<FetchResponseLike>;

export interface StoreHubClientConfig {
  storeName: string;
  apiToken: string;
  baseUrl?: string;
  fetcher?: FetchLike;
}
