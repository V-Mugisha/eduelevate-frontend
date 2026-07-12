export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "educator" | "admin";
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}
