import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate, validateQuery } from "../../middleware/validate";
import { addBookSchema, updateBookSchema, listBooksQuerySchema } from "./userBooks.schema";
import { userBooksController } from "./userBooks.controller";

const router = Router();

router.get("/", authenticate, validateQuery(listBooksQuerySchema), userBooksController.getLibrary);
router.get("/:id", authenticate, userBooksController.getOne);
router.post("/", authenticate, validate(addBookSchema), userBooksController.addBook);
router.put("/:id", authenticate, validate(updateBookSchema), userBooksController.updateBook);
router.delete("/:id", authenticate, userBooksController.removeBook);

export default router;
