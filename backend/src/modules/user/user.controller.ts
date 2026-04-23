import { Request, Response } from "express";
import * as userService from "./user.service";
import {
  CreateAdminPerusahaanInput,
  CreateUserInput,
  UpdateMeInput,
  UpdateUserInput,
} from "./user.type";
import {
  successResponse,
  errorResponse,
  buildDeleteResponse,
} from "../../utils/response";
import { MESSAGES } from "../../constants/message";

type Params = {
  id: string;
};

// controller create user baru
export const create = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
) => {
  try {
    const user = await userService.createUser(req.body, req.user!.id);

    return successResponse(res, user, MESSAGES.SUCCESS.CREATE);
  } catch (err) {
    return errorResponse(
      res,
      err instanceof Error ? err.message : MESSAGES.ERROR.DEFAULT,
    );
  }
};

// controller create admin_perusahaan beserta perusahaan dalam 1 transaksi
export const createAdminPerusahaan = async (
  req: Request<{}, {}, CreateAdminPerusahaanInput>,
  res: Response,
) => {
  try {
    const result = await userService.createAdminPerusahaan(
      req.body,
      req.user!.id,
    );
    return successResponse(res, result, "Admin perusahaan berhasil dibuat");
  } catch (err) {
    return errorResponse(
      res,
      err instanceof Error ? err.message : MESSAGES.ERROR.DEFAULT,
    );
  }
};

// controller get all data user dengan pagination
export const findAll = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(req.query.limit as string) || 5),
  );

  const result = await userService.getUsers(page, limit);

  return successResponse(res, result, MESSAGES.SUCCESS.GET);
};

// controller get data user by id
export const findOne = async (req: Request<Params>, res: Response) => {
  const user = await userService.getUserById(req.params.id);

  return successResponse(res, user, MESSAGES.SUCCESS.GET);
};

// controller update data user by id
export const update = async (
  req: Request<Params, {}, UpdateUserInput>,
  res: Response,
) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return successResponse(res, user, MESSAGES.SUCCESS.UPDATE);
};

// controller untuk menghapus data user berdasarkan id
export const remove = async (req: Request<Params>, res: Response) => {
  const currentUser = req.user!;

  if (currentUser.role !== "super_admin") {
    return errorResponse(res, "Forbidden", 403);
  }

  if (currentUser.id === req.params.id) {
    return errorResponse(res, "Tidak bisa menghapus akun sendiri", 400);
  }

  await userService.deleteUser(req.params.id);

  return successResponse(
    res,
    buildDeleteResponse(req.params.id, currentUser.id),
    MESSAGES.SUCCESS.DELETE,
  );
};

// controller untuk menonaktifkan account user berdasarkan id
export const deactivate = async (req: Request<Params>, res: Response) => {
  const user = await userService.deactivateUser(req.params.id);

  return successResponse(res, user, MESSAGES.SUCCESS.DEACTIVATE);
};

// controller untuk mengaktifkan kembali account user
export const activate = async (req: Request<Params>, res: Response) => {
  const user = await userService.activateUser(req.params.id);

  return successResponse(res, user, MESSAGES.SUCCESS.ACTIVATE);
};

// controller untuk user update data dirinya sendiri
export const updateMe = async (
  req: Request<{}, {}, UpdateMeInput>,
  res: Response,
) => {
  try {
    const user = await userService.updateMe(req.user!.id, req.body);
    return successResponse(res, user, "Profil berhasil diperbarui");
  } catch (err) {
    return errorResponse(
      res,
      err instanceof Error ? err.message : MESSAGES.ERROR.DEFAULT,
    );
  }
};
