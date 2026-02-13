import { CustomerResource } from "../features/customer/resource";
import type {
  Customer,
  CustomerSearchParams,
} from "../features/customer/types";
import { EmployeeResource } from "../features/employee/resource";
import type {
  Employee,
  EmployeeSearchParams,
} from "../features/employee/types";
import { InventoryResource } from "../features/inventory/resource";
import type { Stock } from "../features/inventory/types";
import { ProductResource } from "../features/product/resource";
import type { Product } from "../features/product/types";
import { StoreResource } from "../features/store/resource";
import type { Store } from "../features/store/types";
import { TimesheetResource } from "../features/timesheet/resource";
import type {
  Timesheet,
  TimesheetSearchParams,
} from "../features/timesheet/types";
import { TransactionResource } from "../features/transaction/resource";
import type {
  Transaction,
  TransactionSearchParams,
} from "../features/transaction/types";
import { StoreHubHttpClient, type StoreHubHttpClientConfig } from "./http";

export type StoreHubClientConfig = StoreHubHttpClientConfig;

/**
 * Facade client that composes all StoreHub resources.
 */
export class StoreHubClient {
  public readonly product: ProductResource;
  public readonly customer: CustomerResource;
  public readonly transaction: TransactionResource;
  public readonly inventory: InventoryResource;
  public readonly employee: EmployeeResource;
  public readonly store: StoreResource;
  public readonly timesheet: TimesheetResource;

  /**
   * Creates a StoreHub client facade.
   *
   * @param config - Client configuration including credentials.
   */
  public constructor(config: StoreHubClientConfig) {
    const http = new StoreHubHttpClient(config);

    this.product = new ProductResource(http);
    this.customer = new CustomerResource(http);
    this.transaction = new TransactionResource(http);
    this.inventory = new InventoryResource(http);
    this.employee = new EmployeeResource(http);
    this.store = new StoreResource(http);
    this.timesheet = new TimesheetResource(http);
  }

  /**
   * Gets all products.
   *
   * @returns Product list.
   */
  public async getProducts(): Promise<Product[]> {
    return this.product.list();
  }

  /**
   * Gets a product by id.
   *
   * @param id - Product id.
   * @returns Product if found, otherwise null.
   */
  public async getProductById(id: string): Promise<Product | null> {
    return this.product.getById(id);
  }

  /**
   * Gets a customer by refId.
   *
   * @param refId - Customer reference id.
   * @returns Customer if found, otherwise null.
   */
  public async getCustomerByRefId(refId: string): Promise<Customer | null> {
    return this.customer.getByRefId(refId);
  }

  /**
   * Gets customers with optional filters.
   *
   * @param params - Customer search filters.
   * @returns Matching customers.
   */
  public async getCustomers(
    params: CustomerSearchParams = {}
  ): Promise<Customer[]> {
    return this.customer.list(params);
  }

  /**
   * Gets inventory by store id.
   *
   * @param storeId - Store id.
   * @returns Inventory records.
   */
  public async getInventory(storeId: string): Promise<Stock[]> {
    return this.inventory.getByStoreId(storeId);
  }

  /**
   * Gets transactions with optional filters.
   *
   * @param params - Transaction query filters.
   * @returns Matching transactions.
   */
  public async getTransactions(
    params: TransactionSearchParams = {}
  ): Promise<Transaction[]> {
    return this.transaction.list(params);
  }

  /**
   * Gets employees with optional filters.
   *
   * @param params - Employee search filters.
   * @returns Matching employees.
   */
  public async getEmployees(
    params: EmployeeSearchParams = {}
  ): Promise<Employee[]> {
    return this.employee.list(params);
  }

  /**
   * Gets all stores.
   *
   * @returns Store list.
   */
  public async getStores(): Promise<Store[]> {
    return this.store.list();
  }

  /**
   * Gets timesheets with optional filters.
   *
   * @param params - Timesheet search filters.
   * @returns Matching timesheet records.
   */
  public async getTimesheets(
    params: TimesheetSearchParams = {}
  ): Promise<Timesheet[]> {
    return this.timesheet.list(params);
  }
}
