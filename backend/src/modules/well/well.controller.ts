import { Request, Response } from "express";
import * as wellService from "./well.service";
import { successResponse, errorResponse } from "../../utils/response";
import { CreateWellInput } from "./well.type";
import { MESSAGES } from "../../constants/message";

type Params = {
  id: string;
};

export const create = async (
  req: Request<{}, {}, CreateWellInput>,
  res: Response,
) => {
  try {
    const well = await wellService.createWell(req.body, req.user!.id);

    return successResponse(res, well, MESSAGES.SUCCESS.CREATE);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const findAll = async (_req: Request, res: Response) => {
  const wells = await wellService.getWells();

  return successResponse(res, wells, MESSAGES.SUCCESS.GET);
};

export const findOne = async (req: Request<Params>, res: Response) => {
  const well = await wellService.getWellById(req.params.id);

  return successResponse(res, well, MESSAGES.SUCCESS.GET);
};
