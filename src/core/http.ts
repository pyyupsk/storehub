import { StoreHubApiError } from "./error";

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

export type PrimitiveQueryValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export type QueryParams = Record<string, PrimitiveQueryValue>;

export interface StoreHubHttpClientConfig {
  storeName: string;
  apiToken: string;
  baseUrl?: string;
  fetcher?: FetchLike;
}

/**
 * Shared HTTP layer for StoreHub resources.
 */
export class StoreHubHttpClient {
  private readonly baseUrl: string;
  private readonly fetcher: FetchLike;
  private readonly headers: Record<string, string>;

  /**
   * Creates a configured HTTP client.
   *
   * @param config - HTTP client configuration including credentials.
   */
  public constructor(config: StoreHubHttpClientConfig) {
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
   * Sends a GET request and parses JSON.
   *
   * @param path - Absolute API path, e.g. `/products`.
   * @param query - Optional query parameters.
   * @returns Parsed JSON response.
   */
  public async getJson<T>(path: string, query: QueryParams = {}): Promise<T> {
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

  /**
   * Sends a GET request and returns null for 404 responses.
   *
   * @param path - Absolute API path.
   * @param query - Optional query parameters.
   * @returns Parsed JSON response or null when status is 404.
   */
  public async getJsonOrNull<T>(
    path: string,
    query: QueryParams = {}
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

  private buildUrl(path: string, query: QueryParams): string {
    const url = new URL(path, this.baseUrl);
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }

      searchParams.set(key, normalizeQueryValue(value));
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
