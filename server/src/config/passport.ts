import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envConfig } from "./env";
import { authRepository } from "../modules/auth/auth.repository";
import type { User } from "../modules/auth/auth.types";
import { logger } from "./logger";

// WHY serializeUser / deserializeUser:
// After Passport authenticates a user it needs two operations:
//
//   serializeUser  — runs once on login; converts the user object to a small
//                    token (just the ID) that gets saved in req.session.
//
//   deserializeUser — runs on every subsequent request; reads the token from
//                     the session and fetches the full user from the DB so
//                     req.user is always populated with fresh data.
//
// WHY store only the ID and not the whole user object:
// Sessions are persisted to a database. If we stored the full object we'd have
// stale data whenever a user updates their profile. One lightweight DB read per
// request trades a tiny bit of latency for always-correct user data.
passport.serializeUser((user, done) => {
  
  done(null, String((user as User).id));
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // Parse back to number to match the DB column type (INTEGER).
    const row = await authRepository.findById(Number(id));

    // If the user row no longer exists (deleted between requests), pass false
    // rather than null. Passport treats false as "user not found" and clears
    // req.user without throwing, while null would cause a type warning.
    done(null, row ?? false);
  } catch (err) {
    // WHY done(err) and not throw:
    // Passport calls this function from inside a callback chain. Throwing would
    // produce an unhandled rejection. Passing the error to done() lets Passport
    // forward it to Express's next(err) error handler correctly.
    done(err as Error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: envConfig.GOOGLE_CALLBACK_URL,
    },
    // The verify callback. Google calls our callback URL after the user
    // approves access. Passport decodes the tokens and hands us the profile.
    // We convert it to one of our own User records.

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const { authService } = await import("../modules/auth/auth.service");
        const user = await authService.getOAuthOrCreateUser(profile);
        done(null, user);
      } catch (err) {
        logger.error({ err }, "Google OAuth verify callback error");
        done(err as Error);
      }
    },
  ),
);

export { passport };

export function initializePassport() {
  return {
    initialize: passport.initialize(),

    // passport.session() calls deserializeUser on every request that has a
    // session, populating req.user. MUST come after the session middleware —
    // it reads from req.session, which doesn't exist until that middleware runs.
    session: passport.session(),
  };
}
