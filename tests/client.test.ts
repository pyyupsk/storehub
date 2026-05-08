import type { FetchLike, QueryParams, StoreHubApiError } from "../src";

import { describe, expect, it } from "vitest";
import { StoreHubClient } from "../src";

describe("storeHubClient config", () => {
  it("throws when storeName is empty", () => {
    expect(
      () =>
        new StoreHubClient({
          storeName: "   ",
          apiToken: "token",
          fetcher: createFetchMock(() => jsonResponse([])),
        }),
    ).toThrow("storeName cannot be empty");
  });

  it("throws when apiToken is empty", () => {
    expect(
      () =>
        new StoreHubClient({
          storeName: "demo",
          apiToken: "   ",
          fetcher: createFetchMock(() => jsonResponse([])),
        }),
    ).toThrow("apiToken cannot be empty");
  });

  it("preserves baseUrl that already has a trailing slash", async () => {
    const fetcher = createFetchMock((url) => {
      expect(url).toBe("https://example.test/products");
      return jsonResponse([]);
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      baseUrl: "https://example.test/",
      fetcher,
    });

    await client.getProducts();
  });
});

describe("storeHubClient errors", () => {
  it("returns null only on 404, throws on other errors via getJsonOrNull", async () => {
    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher: createFetchMock(() => textResponse("boom", 503)),
    });

    await expect(client.getCustomerByRefId("x")).rejects.toMatchObject({
      name: "StoreHubApiError",
      status: 503,
    });
  });

  it("handles error responses whose body cannot be read", async () => {
    const fetcher: FetchLike = async () => ({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error("no json");
      },
      text: async () => {
        throw new Error("body unreadable");
      },
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher,
    });

    await expect(client.getStores()).rejects.toMatchObject({
      name: "StoreHubApiError",
      status: 500,
      responseBody: undefined,
    });
  });

  it("throws StoreHubApiError for non-404 failures", async () => {
    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher: createFetchMock(() => textResponse("server error", 500)),
    });

    await expect(client.getStores()).rejects.toMatchObject({
      name: "StoreHubApiError",
      status: 500,
      responseBody: "server error",
    } satisfies Partial<StoreHubApiError>);
  });

  it("throws for non-primitive query values", async () => {
    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher: createFetchMock(() => jsonResponse([])),
    });

    const invalidParams = {
      custom: { nested: true },
    } as unknown as QueryParams;

    await expect(client.getTransactions(invalidParams)).rejects.toThrow(
      "Invalid query value type",
    );
  });
});

describe("storeHubClient requests", () => {
  it("sends authenticated request for products", async () => {
    const fetcher = createFetchMock((url, init) => {
      expect(url).toBe("https://api.storehubhq.com/products");
      expect(init?.method).toBe("GET");
      const headers = init?.headers as
        | { Accept?: string; Authorization?: string }
        | undefined;
      expect(headers?.Accept).toBe("application/json");
      expect(headers?.Authorization).toBe(
        `Basic ${Buffer.from("demo:secret").toString("base64")}`,
      );

      return jsonResponse([{ id: "p1", name: "Coffee", priceType: "Fixed" }]);
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher,
    });

    const products = await client.getProducts();
    expect(products).toHaveLength(1);
    expect(products[0]?.id).toBe("p1");
  });

  it("returns null when getProductById responds with 404", async () => {
    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher: createFetchMock(() => textResponse("not found", 404)),
    });

    await expect(client.getProductById("missing")).resolves.toBeNull();
  });

  it("serializes customer search params", async () => {
    const fetcher = createFetchMock((url) => {
      const parsedUrl = new URL(url);

      expect(parsedUrl.pathname).toBe("/customers");
      expect(parsedUrl.searchParams.get("firstName")).toBe("Ada");
      expect(parsedUrl.searchParams.get("phone")).toBe("0123456789");
      expect(parsedUrl.searchParams.get("email")).toBeNull();

      return jsonResponse([]);
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher,
    });

    await client.getCustomers({
      firstName: "Ada",
      phone: "0123456789",
    });
  });

  it("serializes date query values as ISO 8601", async () => {
    const modifiedSince = new Date("2026-02-13T10:00:00.000Z");
    const fetcher = createFetchMock((url) => {
      const parsedUrl = new URL(url);

      expect(parsedUrl.pathname).toBe("/employees");
      expect(parsedUrl.searchParams.get("modifiedSince")).toBe(
        "2026-02-13T10:00:00.000Z",
      );

      return jsonResponse([]);
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher,
    });

    await client.getEmployees({ modifiedSince });
  });

  it("fetches a customer by refId", async () => {
    const fetcher = createFetchMock((url) => {
      expect(url).toBe("https://api.storehubhq.com/customers/ref%20123");
      return jsonResponse({ refId: "ref 123" });
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher,
    });

    const customer = await client.getCustomerByRefId("ref 123");
    expect(customer?.refId).toBe("ref 123");
  });

  it("fetches inventory by storeId", async () => {
    const fetcher = createFetchMock((url) => {
      expect(url).toBe("https://api.storehubhq.com/inventory/store%2042");
      return jsonResponse([{ productId: "p1", quantity: 10 }]);
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher,
    });

    const stock = await client.getInventory("store 42");
    expect(stock).toHaveLength(1);
  });

  it("fetches timesheets with filters", async () => {
    const fetcher = createFetchMock((url) => {
      const parsedUrl = new URL(url);
      expect(parsedUrl.pathname).toBe("/timesheets");
      expect(parsedUrl.searchParams.get("employeeId")).toBe("e1");
      return jsonResponse([{ id: "t1" }]);
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher,
    });

    const timesheets = await client.getTimesheets({ employeeId: "e1" });
    expect(timesheets).toHaveLength(1);
  });

  it("serializes number and boolean query values", async () => {
    const fetcher = createFetchMock((url) => {
      const parsedUrl = new URL(url);
      expect(parsedUrl.searchParams.get("limit")).toBe("25");
      expect(parsedUrl.searchParams.get("active")).toBe("true");
      expect(parsedUrl.searchParams.get("flagged")).toBe("false");
      return jsonResponse([]);
    });

    const client = new StoreHubClient({
      storeName: "demo",
      apiToken: "secret",
      fetcher,
    });

    await client.getTransactions({
      limit: 25,
      active: true,
      flagged: false,
    });
  });
});

function createFetchMock(
  implementation: (
    url: string,
    init?: { method?: string; headers?: Record<string, string> },
  ) => {
    ok: boolean;
    status: number;
    json: () => Promise<unknown>;
    text: () => Promise<string>;
  },
): FetchLike {
  return async (url, init) => implementation(url, init);
}

function jsonResponse(
  body: unknown,
  status = 200,
): {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
} {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

function textResponse(
  body: string,
  status: number,
): {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
} {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      throw new Error("JSON payload unavailable");
    },
    text: async () => body,
  };
}
