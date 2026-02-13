import { StoreHubHttpClient } from "../../core/http";
import type { Store } from "./types";

/**
 * Store REST resource.
 */
export class StoreResource {
  private readonly http: StoreHubHttpClient;

  /**
   * Creates a store resource client.
   *
   * @param http - Shared StoreHub HTTP client.
   */
  public constructor(http: StoreHubHttpClient) {
    this.http = http;
  }

  /**
   * Lists all stores.
   *
   * @returns Store list.
   */
  public async list(): Promise<Store[]> {
    return this.http.getJson<Store[]>("/stores");
  }
}
