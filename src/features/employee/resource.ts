import { StoreHubHttpClient } from "../../core/http";
import type { Employee, EmployeeSearchParams } from "./types";

/**
 * Employee REST resource.
 */
export class EmployeeResource {
  private readonly http: StoreHubHttpClient;

  /**
   * Creates an employee resource client.
   *
   * @param http - Shared StoreHub HTTP client.
   */
  public constructor(http: StoreHubHttpClient) {
    this.http = http;
  }

  /**
   * Lists employees with optional filters.
   *
   * @param params - Employee search filters.
   * @returns Matching employees.
   */
  public async list(params: EmployeeSearchParams = {}): Promise<Employee[]> {
    return this.http.getJson<Employee[]>("/employees", params);
  }
}
