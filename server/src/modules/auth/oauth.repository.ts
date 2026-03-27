import { pool } from "../../config/db";
import type { OAuthAccountRow, CreateOAuthAccountDto } from "./auth.types";

export const oauthRepository = {
  async findByProvider(provider: string, providerId: string): Promise<OAuthAccountRow | null> {
    const { rows } = await pool.query<OAuthAccountRow>(
      `SELECT * FROM oauth_accounts
       WHERE provider = $1 AND provider_id = $2`,
      [provider, providerId],
    );
    return rows[0] ?? null;
  },

  async create(dto: CreateOAuthAccountDto): Promise<OAuthAccountRow> {
    const { rows } = await pool.query<OAuthAccountRow>(
      `INSERT INTO oauth_accounts (user_id, provider, provider_id, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dto.userId, dto.provider, dto.providerId, dto.email],
    );
    return rows[0];
  },
};
