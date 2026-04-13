import express from "express";
import * as businessController from "./business.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, businessController.create);
router.get("/", authMiddleware, businessController.findAll);
router.get("/:id", authMiddleware, businessController.findOne);
router.patch("/:id", authMiddleware, businessController.update);
router.delete("/:id", authMiddleware, businessController.remove);

export default router;
