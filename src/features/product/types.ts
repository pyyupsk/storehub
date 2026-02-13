export type PriceType = "Fixed" | "Variable";

export interface VariantGroupOption {
  id: string;
  optionValue: string;
  priceDifference: number;
  isDefault?: boolean;
}

export interface VariantGroup {
  id: string;
  name: string;
  options: VariantGroupOption[];
}

export interface VariationValue {
  variantGroupId: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  priceType: PriceType;
  unitPrice?: number;
  cost?: number | null;
  barcode?: string;
  trackStockLevel: boolean;
  isParentProduct: boolean;
  variantGroups?: VariantGroup[];
  parentProductId?: string;
  variationValues?: VariationValue[];
  sku?: string;
}
