import express from "express";
import * as controller from "./kadis-report.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("super_admin"),
  controller.create,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("super_admin", "kepala_instansi"),
  controller.findAll,
);

export default router;
