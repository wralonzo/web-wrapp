import { HttpResponseApi } from '../http/http-response';

export interface PositionType {
  name: string;
  id: number;
  level: number;
}

export interface PostionTypeResponse extends HttpResponseApi<PositionType> {}
