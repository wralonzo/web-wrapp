export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
}

export interface HttpResponseApi<T> {
  success: boolean;
  message: string;
  data: PaginatedResponse<T>; // Los datos están envueltos en 'data'
  status: number;
  timestamp: string;
}

export interface HttpResponseApiFindOne<T> {
  success: boolean;
  message: string;
  data: T | T[];
  status: number;
  timestamp: string;
}
