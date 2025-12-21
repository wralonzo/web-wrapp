import { HttpResponseApi } from "../http/http-response";

// auth.model.ts
export interface User {
  id: number;
  user: string;
  name: string;
  role: string;
  token: string;
  fullName: string;
  username: string;
  phone: string;
  address: string;
  avatar: string | null;
  password: string | null;
  createdAt: string;
  updateAt: string | null;
  deletedAt: string | null;
}

export interface AuthResponse extends HttpResponseApi<User> {
  data: User;
}
