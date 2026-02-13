import { StoreHubHttpClient } from "../../core/http";
import type { Timesheet, TimesheetSearchParams } from "./types";

/**
 * Timesheet REST resource.
 */
export class TimesheetResource {
  private readonly http: StoreHubHttpClient;

  /**
   * Creates a timesheet resource client.
   *
   * @param http - Shared StoreHub HTTP client.
   */
  public constructor(http: StoreHubHttpClient) {
    this.http = http;
  }

  /**
   * Lists timesheet records with optional filters.
   *
   * @param params - Timesheet search filters.
   * @returns Matching timesheet records.
   */
  public async list(params: TimesheetSearchParams = {}): Promise<Timesheet[]> {
    return this.http.getJson<Timesheet[]>("/timesheets", params);
  }
}
