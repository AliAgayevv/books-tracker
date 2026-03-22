import { pool } from "../../config/db";
import type { UserRow, CreateUserRepoDto } from "./auth.types";

export const authRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    const { rows } = await pool.query<UserRow>(`SELECT * FROM users WHERE email = $1`, [email]);
    return rows[0] ?? null;
  },

  async create(dto: CreateUserRepoDto): Promise<UserRow> {
    const { rows } = await pool.query<UserRow>(
      `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [dto.username, dto.email, dto.passwordHash],
    );
    return rows[0];
  },
};
