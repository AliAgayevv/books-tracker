import { Router } from "express";
import { usersController } from "./users.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { updateProfileSchema, changePasswordSchema, deleteAccountSchema } from "./users.schema";

const router = Router();
router.use(authenticate);

router.get("/", usersController.getProfileInformation);
router.put("/", validate(updateProfileSchema), usersController.updateProfileInformation);
router.delete("/", validate(deleteAccountSchema), usersController.deleteAccount);
router.put("/password", validate(changePasswordSchema), usersController.changePassword);

export default router;
