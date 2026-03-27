import speakeasy from "speakeasy";
import QRCode from "qrcode";
import type { TwoFactorSetupResult } from "./auth.types";
import { envConfig } from "../../config/env";

const TOTP_ISSUER = envConfig.APP_NAME_FOR_2FA;

const TOTP_WINDOW = 1;

export const totpService = {
  async generateSecret(username: string): Promise<TwoFactorSetupResult> {
    const generated = speakeasy.generateSecret({
      name: `${TOTP_ISSUER} (${username})`,
      length: 20,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(generated.otpauth_url!);

    return {
      // The base32 secret is stored in the DB and used to verify future codes.
      // It's also shown to the user as a fallback for manual entry if their
      // camera doesn't work.
      secret: generated.base32,
      qrCodeDataUrl,
    };
  },

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: TOTP_WINDOW,
    });
  },
};
