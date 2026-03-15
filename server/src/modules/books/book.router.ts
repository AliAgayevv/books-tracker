import { Router } from "express";
import { bookController } from "./book.controller";
// import { authenticate } from "../../middleware/authenticate";
// import { validate } from "../../middleware/validate";
// import { createBookSchema } from "./book.schema";

const router = Router();

// router.use(authenticate);
router.get("/:id", bookController.getById);
router.post(
  "/",
  // validate(createBookSchema),
  bookController.create,
);

export default router;
