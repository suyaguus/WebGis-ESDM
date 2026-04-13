import { Request, Response } from "express";
import * as userService from "./user.service";
import { CreateUserInput, UpdateUserInput } from "./user.type";
import { successResponse, errorResponse } from "../../utils/response";
import { MESSAGES } from "../../constants/message";

type Params = {
  id: string;
};

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

export const findAll = async (_req: Request, res: Response) => {
  const users = await userService.getUsers();

  return successResponse(res, users, MESSAGES.SUCCESS.GET);
};

export const findOne = async (req: Request<Params>, res: Response) => {
  const user = await userService.getUserById(req.params.id);

  return successResponse(res, user, MESSAGES.SUCCESS.GET);
};

export const update = async (
  req: Request<Params, {}, UpdateUserInput>,
  res: Response,
) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return successResponse(res, user, MESSAGES.SUCCESS.UPDATE);
};

export const remove = async (req: Request<Params>, res: Response) => {
  await userService.deactivateUser(req.params.id);

  return successResponse(res, null, MESSAGES.SUCCESS.DELETE);
};
