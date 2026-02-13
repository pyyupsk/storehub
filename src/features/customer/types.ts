import type { PrimitiveQueryValue } from "../../core/http";

export type CustomerTag = "" | "ปลีก" | "ราคาส่ง 1" | "ราคาส่ง 2";

export interface Customer {
  refId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  createdTime: string;
  modifiedTime: string;
  tags: CustomerTag[];
  birthday: null;
  state?: string;
  loyalty?: number;
}

export interface CustomerSearchParams {
  [key: string]: PrimitiveQueryValue;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}
