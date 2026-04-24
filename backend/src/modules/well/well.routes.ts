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
  roleMiddleware("super_admin", "admin_perusahaan"),
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

export default router;
