import { Router } from "express";
import { passport } from "../../config/passport";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { requireTwoFactor } from "../../middleware/requireTwoFactor";
import { registerSchema, loginSchema, verifyTotpSchema } from "./auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

router.get("/me", authenticate, authController.getCurrentUser);
router.post("/logout", authenticate, authController.logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],

    session: true,
  }),
  authController.googleAuth,
);

router.get(
  "/google/callback",

  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  authController.googleCallback,
);

router.post(
  "/2fa/verify",
  requireTwoFactor,
  validate(verifyTotpSchema),
  authController.verifyTwoFactor,
);

router.post("/2fa/setup", authenticate, authController.setupTwoFactor);
router.post(
  "/2fa/enable",
  authenticate,
  validate(verifyTotpSchema),
  authController.enableTwoFactor,
);
router.post(
  "/2fa/disable",
  authenticate,
  validate(verifyTotpSchema),
  authController.disableTwoFactor,
);

export default router;
