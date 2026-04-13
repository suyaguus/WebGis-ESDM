import { Request, Response } from "express";
import * as userService from "./user.service";
import { CreateUserInput, UpdateUserInput } from "./user.type";

type Params = {
  id: string;
};

export const create = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
) => {
  try {
    const user = await userService.createUser(req.body, req.user!.id);

    return res.json({
      message: "User created",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      message: err instanceof Error ? err.message : "Error",
    });
  }
};

export const findAll = async (_req: Request, res: Response) => {
  const users = await userService.getUsers();

  return res.json({
    message: "Success",
    data: users,
  });
};

export const findOne = async (req: Request<Params>, res: Response) => {
  const user = await userService.getUserById(req.params.id);

  return res.json({
    message: "Success",
    data: user,
  });
};

export const update = async (
  req: Request<Params, {}, UpdateUserInput>,
  res: Response,
) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return res.json({
    message: "Updated",
    data: user,
  });
};

export const remove = async (req: Request<Params>, res: Response) => {
  await userService.deactivateUser(req.params.id);

  return res.json({
    message: "User deactivated",
  });
};
