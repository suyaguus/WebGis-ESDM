import express from "express";
import * as wellController from "./well.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("super_admin", "admin_perusahaan", "supervisor"),
  wellController.create,
);

// GET ALL
router.get("/", authMiddleware, wellController.findAll);

// GET BY ID
router.get("/:id", authMiddleware, wellController.findOne);

// UPDATE
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin", "admin_perusahaan", "supervisor"),
  wellController.update,
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin", "admin_perusahaan"),
  wellController.remove,
);

// VERIFY (only super_admin)
router.patch(
  "/:id/verify",
  authMiddleware,
  roleMiddleware("super_admin"),
  wellController.verify,
);

// GET PENDING WELLS (only super_admin)
router.get(
  "/pending/list",
  authMiddleware,
  roleMiddleware("super_admin"),
  wellController.getPending,
);

// APPROVE PENDING WELL (only super_admin)
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("super_admin"),
  wellController.approve,
);

// REJECT PENDING WELL (only super_admin)
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("super_admin"),
  wellController.reject,
);

// PROCESS DRAFT WELL → pending_approval / send to supervisor (only super_admin)
router.patch(
  "/:id/process",
  authMiddleware,
  roleMiddleware("super_admin"),
  wellController.process,
);

// GET WELLS FOR SUPERVISOR REVIEW (supervisor + super_admin)
router.get(
  "/supervisor/list",
  authMiddleware,
  roleMiddleware("super_admin", "supervisor"),
  wellController.getSupervisorWells,
);

// SUPERVISOR MARKS WELL AS REVIEWED → sends back to super_admin
router.patch(
  "/:id/review",
  authMiddleware,
  roleMiddleware("super_admin", "supervisor"),
  wellController.review,
);

// SUPERVISOR FLAGS A WELL WITH A NOTE (data tidak sesuai)
router.patch(
  "/:id/flag",
  authMiddleware,
  roleMiddleware("super_admin", "supervisor"),
  wellController.flag,
);

export default router;
