// Raw DB rows use snake_case (postgresql convention) and may include internal
// fields that should never leave the server (e.g. password_hash,
// two_factor_secret). Domain objects use camelCase (js convention) and contain
// only what is safe to pass to controllers or return to clients.
// The conversion happens in the service layer via a mapper function (toUser).
// Repository returns Row → Service maps to Domain → Controller sends Domain.

export interface UserRow {
  id: number;
  username: string;
  email: string;

  password_hash: string | null;

  // These columns are added by 002_auth_extensions.sql
  two_factor_secret: string | null;
  two_factor_enabled: boolean;

  created_at: Date;
  updated_at: Date;
}

// Represents a row in the oauth_accounts join table.
export interface OAuthAccountRow {
  id: number;
  user_id: number;
  provider: string;
  provider_id: string;
  email: string | null;
  created_at: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;

  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface CreateUserRepoDto {
  username: string;
  email: string;
  passwordHash: string;
}

export interface CreateOAuthUserRepoDto {
  username: string;
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;

  twoFactorRequired: boolean;
}

export interface TwoFactorSetupResult {
  secret: string;
  qrCodeDataUrl: string;
}

export interface CreateOAuthAccountDto {
  userId: number;
  provider: string;
  providerId: string;
  email: string | null;
}
