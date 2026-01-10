import { HttpResponseApi, HttpResponseApiFindOne } from "../http/http-response";

export interface Product {
  id?: number;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  pricePurchase: number;
  priceSale: number;
  stockMinim: number;
  active?: boolean;
  categoryId: number;
  categoryName?: string;
  supplierId?: number;
  supplierName?: string;
  warehouseId?: number;
  warehouseName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ProductsResponse extends HttpResponseApi<Product> {}
export interface ProductResponse extends HttpResponseApiFindOne<Product[]> {}