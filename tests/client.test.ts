import { describe, expect, it } from "vitest";

import type { FetchLike, QueryParams } from "../src";
import { StoreHubApiError, StoreHubClient } from "../src";

describe("StoreHubClient", () => {
  it("throws when storeName is empty", () => {
    expect(
      () =>
        new StoreHubClient({
          storeName: "   ",
          apiToken: "token",
          fetcher: createFetchMock(() => jsonResponse([])),
        })
    ).toThrow("storeName cannot be empty");
  });

  it("sends authenticated request for products", async () => {
    const fetcher = createFetchMock((url, init) => {
      expect(url).toBe("https://api.storehubhq.com/products");
      expect(init?.method).toBe("GET");
      expect(init?.headers?.["Accept"]).toBe("application/json");
      expect(init?.headers?.["Authorization"]).toBe(
        `Basic ${Buffer.from("demo:secret").toString("base64")}`
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
        "2026-02-13T10:00:00.000Z"
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
      "Invalid query value type"
    );
  });
});

function createFetchMock(
  implementation: (
    url: string,
    init?: { method?: string; headers?: Record<string, string> }
  ) => {
    ok: boolean;
    status: number;
    json: () => Promise<unknown>;
    text: () => Promise<string>;
  }
): FetchLike {
  return async (url, init) => implementation(url, init);
}

function jsonResponse(
  body: unknown,
  status = 200
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
  status: number
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
