import { StoreHubHttpClient } from "../../core/http";
import type { Customer, CustomerSearchParams } from "./types";

/**
 * Customer REST resource.
 */
export class CustomerResource {
  private readonly http: StoreHubHttpClient;

  /**
   * Creates a customer resource client.
   *
   * @param http - Shared StoreHub HTTP client.
   */
  public constructor(http: StoreHubHttpClient) {
    this.http = http;
  }

  /**
   * Gets customers with optional search filters.
   *
   * @param params - Customer search filters.
   * @returns Matching customers.
   */
  public async list(params: CustomerSearchParams = {}): Promise<Customer[]> {
    return this.http.getJson<Customer[]>("/customers", params);
  }

  /**
   * Gets a customer by refId.
   *
   * @param refId - Customer reference id.
   * @returns Customer if found, otherwise null.
   */
  public async getByRefId(refId: string): Promise<Customer | null> {
    return this.http.getJsonOrNull<Customer>(
      `/customers/${encodeURIComponent(refId)}`
    );
  }
}
