import express from "express";
import * as wellController from "./well.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

// CREATE WELL
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin_perusahaan", "super_admin"),
  wellController.create,
);

// GET ALL
router.get("/", authMiddleware, wellController.findAll);

// GET ONE
router.get("/:id", authMiddleware, wellController.findOne);

export default router;
