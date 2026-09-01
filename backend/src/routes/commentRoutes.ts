import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createComment, deleteComment } from "../controllers/commentCotroller";

const router = Router();
router.post("/:productId", requireAuth(), createComment);
router.delete("/:productId", requireAuth(), deleteComment);
export default router;
