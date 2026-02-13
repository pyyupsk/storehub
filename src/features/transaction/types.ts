import type { QueryParams } from "../../core/http";

export interface Transaction {
  refId: string;
  invoiceNumber: string;
  storeId: string;
  registerId: string;
  employeeId: string;
  transactionType: "Sale" | "Return";
  transactionTime: string;
  total: number;
  subTotal: number;
  tax: number;
  discount: number;
  tableId: null | string;
  roundedAmount: number;
  serviceCharge: number;
  seniorDiscount: number;
  pwdDiscount: number;
  athleteAndCoachDiscount: number;
  medalOfValorDiscount: number;
  soloParentDiscount: number;
  promotions: TransactionPromotion[];
  items: TransactionItem[];
  payments: TransactionPayment[];
  isCancelled: boolean;
  terminalNumber: number;
  channel: string;
  customerRefId?: string;
  cancelledTime?: string;
  cancelledBy?: string;
  returnReason?: string;
  saleInvoiceNumber?: string;
}

export interface TransactionPromotion {
  id: string;
  name: string;
  discount: number;
  tax: number;
}

export interface TransactionSelectedOption {
  groupId: string;
  optionId: string;
  optionValue: string;
  quantity: number;
}

export interface TransactionItem {
  productId: string;
  quantity: number;
  total: number;
  subTotal: number;
  tax?: number;
  taxCode: string;
  discount: number;
  unitPrice?: number;
  itemType: string;
  notes: string;
  promotions: unknown[];
  selectedOptions?: TransactionSelectedOption[];
}

export interface TransactionPayment {
  paymentMethod: string;
  amount: number;
}

export type TransactionSearchParams = QueryParams;
