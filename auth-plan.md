# Auth Implementation Plan

Session-based auth + OAuth (Google) + 2FA (TOTP)

---

## Kurulacak Paketler

```bash
# runtime
npm install express-session connect-pg-simple passport passport-google-oauth20 speakeasy qrcode --workspace=server

# types
npm install --save-dev @types/express-session @types/passport @types/passport-google-oauth20 @types/speakeasy @types/qrcode --workspace=server
```

> `connect-pg-simple` — mevcut PostgreSQL'i session store olarak kullanır, ayrıca Redis kurmak gerekmez. İleride `connect-redis` ile swap kolay.

---

## DB Değişiklikleri — `002_auth_extensions.sql`

```sql
-- 2FA kolonları
ALTER TABLE users
  ADD COLUMN two_factor_secret  VARCHAR(255),
  ADD COLUMN two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- OAuth kullanıcılarının şifresi olmayacak
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- OAuth hesapları (bir kullanıcı birden fazla provider'a bağlanabilir)
CREATE TABLE oauth_accounts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider    VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider, provider_id)
);

CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
```

---

## Yeni Oluşturulacak Dosyalar

| Dosya | Açıklama |
|---|---|
| `server/src/types/session.d.ts` | `express-session` type augmentation (`userId`, `pendingUserId`, `twoFactorPending`) |
| `server/src/config/session.ts` | Session store (connect-pg-simple) + cookie konfigürasyonu |
| `server/src/config/passport.ts` | Google strategy, `serializeUser` / `deserializeUser` |
| `server/src/modules/auth/totp.service.ts` | TOTP secret üretimi, QR kod, verify |
| `server/src/modules/auth/oauth.repository.ts` | `oauth_accounts` tablosu CRUD |
| `server/src/middleware/authenticate.ts` | `req.session.authenticated` kontrolü — korumalı route'lar için |
| `server/src/middleware/requireTwoFactor.ts` | `twoFactorPending` kontrolü — 2FA verify route'u için |

---

## Güncellenecek Dosyalar

| Dosya | Ne Değişiyor |
|---|---|
| `auth.repository.ts` | `findById`, `updateTwoFactorSecret`, `enableTwoFactor`, `disableTwoFactor` ekleniyor |
| `auth.service.ts` | `login` 2FA dallanması + `setupTwoFactor`, `verifyTwoFactor`, `getOAuthOrCreateUser` ekleniyor |
| `auth.controller.ts` | `getCurrentUser` + `logout` stub'ları implement ediliyor; `googleCallback`, `setupTwoFactor`, `verifyTwoFactor` ekleniyor |
| `auth.router.ts` | Google OAuth route'ları + 2FA route'ları ekleniyor |
| `auth.schema.ts` | `verifyTotpSchema` ekleniyor |
| `auth.types.ts` | `AuthResponse` kaldırılıyor → `LoginResult`, `TwoFactorSetupResult`, `OAuthAccountRow` ekleniyor |
| `env.ts` | `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` ekleniyor |
| `validateEnv.ts` | Yeni env değişkenleri zorunlu kontrole ekleniyor |
| `app.ts` | Session + Passport middleware mount ediliyor |

---

## Uygulama Sırası

### Adım 1 — Temel Altyapı
- [ ] Paketleri kur
- [ ] `server/src/types/session.d.ts` — type augmentation
- [ ] `env.ts` + `validateEnv.ts` — yeni env değişkenleri
- [ ] `002_auth_extensions.sql` — DB migration

### Adım 2 — Session ve Passport Config
- [ ] `config/session.ts` — store + cookie ayarları
- [ ] `auth.repository.ts` — `findById` ekle (Passport'un `deserializeUser`'ı için gerekli)
- [ ] `config/passport.ts` — Google strategy + serialize/deserialize
- [ ] `app.ts` — session + passport middleware mount

### Adım 3 — Repository Katmanı
- [ ] `auth.repository.ts` — `updateTwoFactorSecret`, `enableTwoFactor`, `disableTwoFactor`
- [ ] `oauth.repository.ts` — `findByProvider`, `create`, `linkToUser`

### Adım 4 — Service Katmanı
- [ ] `auth.types.ts` — yeni tipler
- [ ] `totp.service.ts` — TOTP mantığı
- [ ] `auth.service.ts` — `login` refactor + yeni metodlar

### Adım 5 — Middleware
- [ ] `middleware/authenticate.ts`
- [ ] `middleware/requireTwoFactor.ts`

### Adım 6 — Controller ve Router
- [ ] `auth.controller.ts` — stub'ları implement et + yeni handler'lar
- [ ] `auth.schema.ts` — `verifyTotpSchema`
- [ ] `auth.router.ts` — yeni route'lar

---

## Route Tablosu (Tamamlandığında)

| Method | Path | Middleware | Açıklama |
|---|---|---|---|
| POST | `/api/auth/register` | validate | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | validate | Giriş (2FA varsa partial session) |
| POST | `/api/auth/logout` | authenticate | Session destroy |
| GET | `/api/auth/me` | authenticate | Oturumdaki kullanıcı |
| GET | `/api/auth/google` | — | Google OAuth başlat |
| GET | `/api/auth/google/callback` | — | Google OAuth callback |
| POST | `/api/auth/2fa/setup` | authenticate | TOTP secret üret, QR döndür |
| POST | `/api/auth/2fa/verify` | requireTwoFactor | TOTP kodu doğrula (login flow) |
| POST | `/api/auth/2fa/enable` | authenticate | İlk kurulumda enable |
| POST | `/api/auth/2fa/disable` | authenticate | 2FA devre dışı bırak |

---

## Session State

```typescript
// Kısmi kimlik doğrulama — 2FA bekleniyor
req.session = { pendingUserId: 123, twoFactorPending: true }

// Tam kimlik doğrulama
req.session = { userId: 123, authenticated: true }
```

## 2FA Login Flow

```
POST /login
  ├─ 2FA kapalı → session { userId, authenticated: true }          → 200 OK
  └─ 2FA açık  → session { pendingUserId, twoFactorPending: true } → 200 { twoFactorRequired: true }

POST /2fa/verify  ← requireTwoFactor middleware
  ├─ TOTP OK   → session { userId, authenticated: true }           → 200 OK
  └─ TOTP fail → 401 UNAUTHORIZED
```

## OAuth Flow

```
GET /google → Passport Google yönlendirmesi
GET /google/callback → Passport doğrular
  ├─ Yeni kullanıcı → oauth_accounts + users'a kaydet → session
  └─ Mevcut kullanıcı → oauth_accounts'tan bul → session
```

---

## Önemli Kararlar

- `password_hash` `NULL` yapılabilir — OAuth kullanıcılarının şifresi yok; service katmanında `password_hash IS NULL` ise şifre login'i reddet
- `connect-pg-simple` şimdilik yeterli; prod'da `connect-redis` ile swap tek dosya değişikliği (`config/session.ts`)
- Cookie: `httpOnly: true`, `secure: true` (prod), `sameSite: strict` — frontend aynı origin veya reverse proxy arkasında olmalı
- Passport `done()` callback'te AppError fırlatılamaz — `done(null, false, { message })` veya `done(err)` kullanılır