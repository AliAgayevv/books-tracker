import { pool } from "../../config/db";
import type { UserRow } from "../auth/auth.types";
import type { UpdateUserProfileDto } from "./users.types";

export const usersRepository = {
  async findById(userId: number): Promise<UserRow | null> {
    const { rows } = await pool.query<UserRow>(`SELECT * FROM users WHERE id = $1`, [userId]);
    return rows[0] ?? null;
  },

  async findByUsername(username: string): Promise<UserRow | null> {
    const { rows } = await pool.query<UserRow>(`SELECT * FROM users WHERE username = $1`, [username]);
    return rows[0] ?? null;
  },

  async updateById(userId: number, dto: UpdateUserProfileDto): Promise<UserRow | null> {
    const { rows } = await pool.query<UserRow>(
      `UPDATE users
       SET username = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [dto.username, userId],
    );
    return rows[0] ?? null;
  },

  async deleteById(userId: number): Promise<void> {
    await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  },

  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await pool.query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [
      passwordHash,
      userId,
    ]);
  },
};
