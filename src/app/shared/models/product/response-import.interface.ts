import { HttpResponseApiFindOne } from '../http/http-response';

export interface ImportProduct {
  created: number;
  updated: number;
  failed: number;
  errorDetails: string[];
  warnings: string[];
}

export interface ImportProductResponse extends HttpResponseApiFindOne<ImportProduct> {}
