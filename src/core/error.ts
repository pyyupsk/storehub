/**
 * Error thrown when the StoreHub API responds with a non-success status.
 */
export class StoreHubApiError extends Error {
  public readonly status: number;
  public readonly url: string;
  public readonly responseBody: string | undefined;

  /**
   * Creates a StoreHub API error.
   *
   * @param message - Error message.
   * @param options - Error details.
   * @param options.status - HTTP status code.
   * @param options.url - Request URL.
   * @param options.responseBody - Optional raw response body.
   */
  public constructor(
    message: string,
    options: { status: number; url: string; responseBody?: string }
  ) {
    super(message);
    this.name = "StoreHubApiError";
    this.status = options.status;
    this.url = options.url;
    this.responseBody = options.responseBody;
  }
}
