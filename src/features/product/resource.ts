import { StoreHubHttpClient } from "../../core/http";
import type { Product } from "./types";

/**
 * Product REST resource.
 */
export class ProductResource {
  private readonly http: StoreHubHttpClient;

  /**
   * Creates a product resource client.
   *
   * @param http - Shared StoreHub HTTP client.
   */
  public constructor(http: StoreHubHttpClient) {
    this.http = http;
  }

  /**
   * Lists products.
   *
   * @returns Product list.
   */
  public async list(): Promise<Product[]> {
    return this.http.getJson<Product[]>("/products");
  }

  /**
   * Gets a product by id.
   *
   * @param id - Product id.
   * @returns Product if found, otherwise null.
   */
  public async getById(id: string): Promise<Product | null> {
    return this.http.getJsonOrNull<Product>(
      `/products/${encodeURIComponent(id)}`
    );
  }
}
