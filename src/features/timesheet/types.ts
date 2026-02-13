import type { PrimitiveQueryValue } from "../../core/http";

export interface Timesheet {
  employeeId: string;
  storeId: string;
  clockInTime: string;
  clockOutTime: string;
}

export interface TimesheetSearchParams {
  [key: string]: PrimitiveQueryValue;
  storeId?: string;
  employeeId?: string;
  from?: string | Date;
  to?: string | Date;
}
