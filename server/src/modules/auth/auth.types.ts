export interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTO with raw password received from client-side.
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

// DTO for creating a user in the repository layer. Already hashed
export interface CreateUserRepoDto {
  username: string;
  email: string;
  passwordHash: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
