import { describe, expect, it } from "vitest";

import { StoreHubApiError } from "../src/error";

describe("StoreHubApiError", () => {
  const message = "Request failed";

  it("stores status, url, and optional body", () => {
    const error = new StoreHubApiError(message, {
      status: 400,
      url: "https://api.storehubhq.com/products",
      responseBody: "bad request",
    });

    expect(error.name).toBe("StoreHubApiError");
    expect(error.message).toBe(message);
    expect(error.status).toBe(400);
    expect(error.url).toBe("https://api.storehubhq.com/products");
    expect(error.responseBody).toBe("bad request");
  });

  it("allows missing response body", () => {
    const error = new StoreHubApiError(message, {
      status: 502,
      url: "https://api.storehubhq.com/stores",
    });

    expect(error.responseBody).toBeUndefined();
  });
});
