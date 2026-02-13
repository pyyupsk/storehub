import type { PrimitiveQueryValue } from "../../core/http";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdTime: string;
  modifiedTime: string;
}

export interface EmployeeSearchParams {
  [key: string]: PrimitiveQueryValue;
  modifiedSince?: string | Date;
}
