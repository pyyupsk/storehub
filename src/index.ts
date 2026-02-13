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

export type PrimitiveQueryValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;
export type QueryParams = Record<string, PrimitiveQueryValue>;

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

/**
 * Error thrown when the StoreHub API responds with a non-success status.
 */
export class StoreHubApiError extends Error {
  public readonly status: number;
  public readonly url: string;
  public readonly responseBody: string | undefined;

  /**
   * Creates a StoreHub API error.
   *
   * @param message - Error message.
   * @param options - Error details.
   * @param options.status - HTTP status code.
   * @param options.url - Request URL.
   * @param options.responseBody - Optional raw response body.
   */
  public constructor(
    message: string,
    options: { status: number; url: string; responseBody?: string }
  ) {
    super(message);
    this.name = "StoreHubApiError";
    this.status = options.status;
    this.url = options.url;
    this.responseBody = options.responseBody;
  }
}

/**
 * Thin API client for StoreHub REST endpoints documented in `docs/StoreHub.md`.
 */
export class StoreHubClient {
  private readonly baseUrl: string;
  private readonly fetcher: FetchLike;
  private readonly headers: Record<string, string>;

  /**
   * Creates a new StoreHub API client.
   *
   * @param config - Client configuration including credentials.
   */
  public constructor(config: StoreHubClientConfig) {
    const storeName = config.storeName.trim();
    const apiToken = config.apiToken.trim();

    if (storeName.length === 0) {
      throw new Error(
        "StoreHubClient config error: storeName cannot be empty."
      );
    }
    if (apiToken.length === 0) {
      throw new Error("StoreHubClient config error: apiToken cannot be empty.");
    }

    this.baseUrl = normalizeBaseUrl(
      config.baseUrl ?? "https://api.storehubhq.com"
    );

    const globalFetch = (globalThis as { fetch?: FetchLike }).fetch;
    this.fetcher = config.fetcher ?? globalFetch ?? missingFetchImplementation;

    const basicAuthToken = encodeBasicAuth(`${storeName}:${apiToken}`);
    this.headers = {
      Accept: "application/json",
      Authorization: `Basic ${basicAuthToken}`,
    };
  }

  /**
   * Gets all products.
   *
   * @returns Product list.
   */
  public async getProducts(): Promise<Product[]> {
    return this.requestJson<Product[]>("/products");
  }

  /**
   * Gets a product by id, returning null when not found.
   *
   * @param id - Product id.
   * @returns Product if found, otherwise null.
   */
  public async getProductById(id: string): Promise<Product | null> {
    return this.requestJsonOrNull<Product>(
      `/products/${encodeURIComponent(id)}`
    );
  }

  /**
   * Gets a customer by refId, returning null when not found.
   *
   * @param refId - Customer reference id.
   * @returns Customer if found, otherwise null.
   */
  public async getCustomerByRefId(refId: string): Promise<Customer | null> {
    return this.requestJsonOrNull<Customer>(
      `/customers/${encodeURIComponent(refId)}`
    );
  }

  /**
   * Gets all customers or filters by query params.
   *
   * @param params - Optional customer search filters.
   * @returns Matching customer list.
   */
  public async getCustomers(
    params: CustomerSearchParams = {}
  ): Promise<Customer[]> {
    return this.requestJson<Customer[]>("/customers", params);
  }

  /**
   * Gets inventory for a specific store id.
   *
   * @param storeId - Store id.
   * @returns Inventory records for products that track stock.
   */
  public async getInventory(storeId: string): Promise<Stock[]> {
    return this.requestJson<Stock[]>(
      `/inventory/${encodeURIComponent(storeId)}`
    );
  }

  /**
   * Gets transactions with optional query filters.
   *
   * @param params - Optional query filters.
   * @returns Matching transaction list.
   */
  public async getTransactions(
    params: QueryParams = {}
  ): Promise<Transaction[]> {
    return this.requestJson<Transaction[]>("/transactions", params);
  }

  /**
   * Gets employees with optional modifiedSince filter.
   *
   * @param params - Optional employee search filters.
   * @returns Matching employee list.
   */
  public async getEmployees(
    params: EmployeeSearchParams = {}
  ): Promise<Employee[]> {
    return this.requestJson<Employee[]>("/employees", params);
  }

  /**
   * Gets all stores.
   *
   * @returns Store list.
   */
  public async getStores(): Promise<Store[]> {
    return this.requestJson<Store[]>("/stores");
  }

  /**
   * Gets timesheets with optional store/employee/date filters.
   *
   * @param params - Optional timesheet search filters.
   * @returns Matching timesheet records.
   */
  public async getTimesheets(
    params: TimesheetSearchParams = {}
  ): Promise<Timesheet[]> {
    return this.requestJson<Timesheet[]>("/timesheets", params);
  }

  private async requestJson<T>(path: string, query?: QueryParams): Promise<T> {
    const url = this.buildUrl(path, query);
    const response = await this.fetcher(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      const responseBody = await safeReadResponseBody(response);
      const options =
        responseBody === undefined
          ? { status: response.status, url }
          : { status: response.status, url, responseBody };
      throw new StoreHubApiError(
        `StoreHub request failed (${response.status}) for ${path}.`,
        options
      );
    }

    return (await response.json()) as T;
  }

  private async requestJsonOrNull<T>(
    path: string,
    query?: QueryParams
  ): Promise<T | null> {
    const url = this.buildUrl(path, query);
    const response = await this.fetcher(url, {
      method: "GET",
      headers: this.headers,
    });

    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      const responseBody = await safeReadResponseBody(response);
      const options =
        responseBody === undefined
          ? { status: response.status, url }
          : { status: response.status, url, responseBody };
      throw new StoreHubApiError(
        `StoreHub request failed (${response.status}) for ${path}.`,
        options
      );
    }

    return (await response.json()) as T;
  }

  private buildUrl(path: string, query: QueryParams = {}): string {
    const url = new URL(path, this.baseUrl);
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }

      const normalizedValue =
        value instanceof Date ? value.toISOString() : String(value);
      searchParams.set(key, normalizedValue);
    }

    const queryString = searchParams.toString();
    if (queryString.length > 0) {
      url.search = queryString;
    }

    return url.toString();
  }
}

const missingFetchImplementation: FetchLike = async () => {
  throw new Error(
    "StoreHubClient requires a fetch implementation. Pass config.fetcher when fetch is unavailable."
  );
};

function normalizeBaseUrl(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function encodeBasicAuth(value: string): string {
  const buffer = (
    globalThis as {
      Buffer?: {
        from(input: string): { toString(encoding: "base64"): string };
      };
    }
  ).Buffer;

  if (buffer) {
    return buffer.from(value).toString("base64");
  }

  const btoaLike = (globalThis as { btoa?: (input: string) => string }).btoa;
  if (btoaLike) {
    return btoaLike(value);
  }

  throw new Error("No base64 encoder is available in the current runtime.");
}

async function safeReadResponseBody(
  response: FetchResponseLike
): Promise<string | undefined> {
  try {
    const body = await response.text();
    return body.length > 0 ? body : undefined;
  } catch {
    return undefined;
  }
}
