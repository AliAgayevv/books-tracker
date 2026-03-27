import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { envConfig } from "./env";

const PgStore = connectPgSimple(session);

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

const sessionStore = new PgStore({
  pool,

  // connect-pg-simple needs a `session` table with a specific schema. Rather
  // than adding yet another migration file just for this one internal table,
  // we let the library manage its own schema.
  createTableIfMissing: true,

  ttl: SEVEN_DAYS_IN_SECONDS,
});

const isProduction = envConfig.NODE_ENV === "production";

export const sessionMiddleware = session({
  // The store we just configured. Without this, express-session defaults to
  // in-memory storage, which loses all sessions on server restart and doesn't
  // work across multiple server instances.
  store: sessionStore,

  secret: envConfig.SESSION_SECRET,

  // Without this, express-session would re-save the session to the store on
  // every single request, even if nothing changed. This creates unnecessary DB
  // writes and can cause race conditions on concurrent requests. `false` means
  // "only save when the session has actually been modified."
  resave: false,

  // An uninitialized session is one that is new but not modified (e.g., a
  // visitor who hasn't logged in). Saving those would flood the session store
  // with empty rows for every anonymous request. `false` means sessions are
  // only persisted once something is actually written to them (like userId on
  // login).
  saveUninitialized: false,

  cookie: {
    // This flag makes the cookie inaccessible to JavaScript running in the
    // browser (document.cookie). This is the primary defence against XSS
    // attacks stealing session IDs — even if an attacker injects a script, it
    // cannot read this cookie.
    httpOnly: true,

    secure: isProduction,

    sameSite: "strict",

    // 7 days in milliseconds
    maxAge: SEVEN_DAYS_IN_SECONDS * 1000,
  },
});
