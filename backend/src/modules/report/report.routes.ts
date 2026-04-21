import express from "express";
import * as reportController from "./report.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin_perusahaan"),
  reportController.create,
);

// GET
router.get(
  "/",
  authMiddleware,
  roleMiddleware("super_admin", "supervisor", "kepala_instansi"),
  reportController.findAll,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin", "supervisor", "kepala_instansi"),
  reportController.findOne,
);

// APPROVE
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("super_admin", "supervisor", "kepala_instansi"),
  reportController.approve,
);

// REJECT
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("super_admin", "supervisor", "kepala_instansi"),
  reportController.reject,
);

export default router;
