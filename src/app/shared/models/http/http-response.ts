export interface HttpResponseApi<T> {
  success: boolean;
  message: string;
  data: T | T[];
  status: number;
  timestamp: string;
}
