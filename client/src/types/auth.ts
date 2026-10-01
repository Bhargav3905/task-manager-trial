export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}
