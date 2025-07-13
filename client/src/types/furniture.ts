import type { 
  ApiCollection, 
  ApiProduct, 
  ApiConfiguration, 
  ApiMaterial, 
  ApiMechanism,
  PriceCalculationReq,
  PriceCalculationRes 
} from "@shared/schema";

export type {
  ApiCollection,
  ApiProduct,
  ApiConfiguration,
  ApiMaterial,
  ApiMechanism,
  PriceCalculationReq,
  PriceCalculationRes
};

export interface ProductWithConfigurations extends ApiProduct {
  configurations?: ApiConfiguration[];
}

export interface CollectionWithProducts extends ApiCollection {
  products?: ApiProduct[];
}

export interface ConfigurationState {
  productId: number;
  configurationId?: number;
  materialId?: number;
  mechanismIds: number[];
  quantity: number;
}

export interface PriceBreakdown {
  basePrice: number;
  materialCost: number;
  mechanismCost: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
