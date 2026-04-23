import express from "express";
import * as userController from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = express.Router();

// route untuk get semua data user
router.get("/", authMiddleware, userController.findAll);

// route untuk get data user berdasarkan id
router.get("/:id", authMiddleware, userController.findOne);

// route untuk create data user
router.post(
  "/",
  authMiddleware,
  roleMiddleware("super_admin"),
  userController.create,
);

// route khusus untuk membuat admin_perusahaan + perusahaan sekaligus
router.post(
  "/admin-perusahaan",
  authMiddleware,
  roleMiddleware("super_admin"),
  userController.createAdminPerusahaan,
);

// route untuk update data user berdasarkan id
router.patch("/:id", authMiddleware, userController.update);

// route untuk menonaktifkan account user berdasarkan id
router.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware("admin_perusahaan", "super_admin"),
  userController.deactivate,
);

// route untuk mengaktifkan kembali account user yang sudah dinonaktifkan berdasarkan id
router.patch(
  "/:id/activate",
  authMiddleware,
  roleMiddleware("admin_perusahaan", "super_admin"),
  userController.activate,
);

// route untuk menghapus data user berdasarkan id
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("super_admin"),
  userController.remove,
);

export default router;
