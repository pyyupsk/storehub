import { StoreHubHttpClient } from "../../core/http";
import type { Stock } from "./types";

/**
 * Inventory REST resource.
 */
export class InventoryResource {
  private readonly http: StoreHubHttpClient;

  /**
   * Creates an inventory resource client.
   *
   * @param http - Shared StoreHub HTTP client.
   */
  public constructor(http: StoreHubHttpClient) {
    this.http = http;
  }

  /**
   * Gets inventory by store id.
   *
   * @param storeId - Store id.
   * @returns Inventory records.
   */
  public async getByStoreId(storeId: string): Promise<Stock[]> {
    return this.http.getJson<Stock[]>(
      `/inventory/${encodeURIComponent(storeId)}`
    );
  }
}
