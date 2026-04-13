import express from "express";
import * as userController from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

router.get("/", authMiddleware, userController.findAll);

router.get("/:id", authMiddleware, userController.findOne);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("super_admin"),
  userController.create,
);

router.patch(
  "/:id",
  authMiddleware,
  userController.update
);

router.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware("admin_perusahaan", "super_admin"),
  userController.deactivate,
);

router.patch(
  "/:id/activate",
  authMiddleware,
  roleMiddleware("admin_perusahaan", "super_admin"),
  userController.activate
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin"),
  userController.remove,
);

export default router;
