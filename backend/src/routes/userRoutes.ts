import { Router } from "express";
import { syncUser } from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/", requireAuth(), syncUser);

export default router;
