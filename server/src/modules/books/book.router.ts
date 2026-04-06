import { Router } from "express";
import { bookController } from "./book.controller";
import { authenticate } from "../../middleware/authenticate";
import { validateQuery } from "../../middleware/validate";
import { rateLimitMiddleware } from "../../middleware/rateLimiterMiddleware";
import { rateLimitConfigs } from "../../config/rateLimiter";
import { searchBookSchema } from "./book.schema";

const router = Router();
const searchRateLimit = rateLimitMiddleware(rateLimitConfigs.search);

router.use(authenticate);

router.get("/search", searchRateLimit, validateQuery(searchBookSchema), bookController.search);
router.get("/:id", bookController.getById);

export default router;