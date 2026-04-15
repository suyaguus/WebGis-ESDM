import express from "express";
import * as businessController from "./business.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("super_admin", "admin_perusahaan"),
  businessController.create,
);

// GET ALL (ONLY SUPER ADMIN)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("super_admin"),
  businessController.findAll,
);

// GET BY ID
router.get("/:id", authMiddleware, businessController.findOne);

// UPDATE
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin", "admin_perusahaan"),
  businessController.update,
);

// DELETE (ONLY SUPER ADMIN)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin"),
  businessController.remove,
);

export default router;
