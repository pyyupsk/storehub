import { StoreHubHttpClient } from "../../core/http";
import type { Transaction, TransactionSearchParams } from "./types";

/**
 * Transaction REST resource.
 */
export class TransactionResource {
  private readonly http: StoreHubHttpClient;

  /**
   * Creates a transaction resource client.
   *
   * @param http - Shared StoreHub HTTP client.
   */
  public constructor(http: StoreHubHttpClient) {
    this.http = http;
  }

  /**
   * Lists transactions with optional query filters.
   *
   * @param params - Query filters.
   * @returns Matching transactions.
   */
  public async list(
    params: TransactionSearchParams = {}
  ): Promise<Transaction[]> {
    return this.http.getJson<Transaction[]>("/transactions", params);
  }
}
