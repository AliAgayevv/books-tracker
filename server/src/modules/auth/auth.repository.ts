import { pool } from "../../config/db";
import type { UserRow, CreateUserRepoDto, CreateOAuthUserRepoDto } from "./auth.types";

export const authRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    const { rows } = await pool.query<UserRow>(`SELECT * FROM users WHERE email = $1`, [email]);
    return rows[0] ?? null;
  },

  async findById(id: number): Promise<UserRow | null> {
    const { rows } = await pool.query<UserRow>(`SELECT * FROM users WHERE id = $1`, [id]);
    return rows[0] ?? null;
  },

  async create(dto: CreateUserRepoDto): Promise<UserRow> {
    // postgresql > mysql, look that beauty of RETURING *
    const { rows } = await pool.query<UserRow>(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dto.username, dto.email, dto.passwordHash],
    );
    return rows[0];
  },

  async createOAuthUser(dto: CreateOAuthUserRepoDto): Promise<UserRow> {
    const { rows } = await pool.query<UserRow>(
      `INSERT INTO users (username, email)
       VALUES ($1, $2)
       RETURNING *`,
      [dto.username, dto.email],
    );
    return rows[0];
  },

  async updateTwoFactorSecret(userId: number, secret: string): Promise<void> {
    await pool.query(
      `UPDATE users
       SET two_factor_secret = $1, updated_at = NOW()
       WHERE id = $2`,
      [secret, userId],
    );
  },

  async enableTwoFactor(userId: number): Promise<void> {
    await pool.query(
      `UPDATE users
       SET two_factor_enabled = TRUE, updated_at = NOW()
       WHERE id = $1`,
      [userId],
    );
  },

  async disableTwoFactor(userId: number): Promise<void> {
    await pool.query(
      `UPDATE users
       SET two_factor_enabled = FALSE, two_factor_secret = NULL, updated_at = NOW()
       WHERE id = $1`,
      [userId],
    );
  },
};
