import express from "express";
import * as auditController from "./audit.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("super_admin"),
  auditController.findAll,
);

export default router;
