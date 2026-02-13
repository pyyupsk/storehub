import { StoreHubApiError } from "./error";
import type {
  Customer,
  CustomerSearchParams,
  Employee,
  EmployeeSearchParams,
  FetchLike,
  FetchResponseLike,
  Product,
  QueryParams,
  Stock,
  Store,
  StoreHubClientConfig,
  Timesheet,
  TimesheetSearchParams,
  Transaction,
} from "./types";

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
      throw await createStoreHubApiError(path, response, url);
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
      throw await createStoreHubApiError(path, response, url);
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

      const normalizedValue = normalizeQueryValue(value);
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

async function createStoreHubApiError(
  path: string,
  response: FetchResponseLike,
  url: string
): Promise<StoreHubApiError> {
  const responseBody = await safeReadResponseBody(response);
  const options =
    responseBody === undefined
      ? { status: response.status, url }
      : { status: response.status, url, responseBody };

  return new StoreHubApiError(
    `StoreHub request failed (${response.status}) for ${path}.`,
    options
  );
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

function normalizeQueryValue(
  value: Exclude<QueryParams[string], null | undefined>
): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  throw new TypeError(
    "Invalid query value type. Expected string, number, boolean, or Date."
  );
}
