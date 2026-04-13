import express from "express";
import * as companyController from "./company.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("super_admin", "admin_perusahaan"),
  companyController.create,
);

router.get("/", authMiddleware, companyController.findAll);

router.get("/:id", authMiddleware, companyController.findOne);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin", "admin_perusahaan"),
  companyController.update,
);

router.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware("super_admin"),
  companyController.deactivate,
);

router.patch(
  "/:id/activate",
  authMiddleware,
  roleMiddleware("super_admin"),
  companyController.activate,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin", "admin_perusahaan"),
  companyController.remove,
);

export default router;
