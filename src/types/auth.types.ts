export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';
  tenant: {
    id: string;
    name: string;
    subdomain: string;
    plan: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupData {
  tenantName: string;
  subdomain: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  plan?: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
}
