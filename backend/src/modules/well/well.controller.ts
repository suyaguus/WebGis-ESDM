import { Request, Response } from "express";
import * as wellService from "./well.service";
import { successResponse, errorResponse } from "../../utils/response";

type Params = { id: string };

export const create = async (req: Request, res: Response) => {
  try {
    const data = await wellService.createWell(req.body, req.user);

    return successResponse(res, data, "Well berhasil dibuat", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const data = await wellService.getWells(req.user, {
      page: page as string | undefined,
      limit: limit as string | undefined,
    });

    return successResponse(res, data, "Success", req.user);
  } catch (err) {
    console.error("[Well.findAll] Error:", err);
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const findOne = async (req: Request<Params>, res: Response) => {
  try {
    const data = await wellService.getWellById(req.params.id, req.user);

    return successResponse(res, data, "Success", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const update = async (req: Request<Params>, res: Response) => {
  try {
    const data = await wellService.updateWell(
      req.params.id,
      req.body,
      req.user,
    );

    return successResponse(res, data, "Updated", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const remove = async (req: Request<Params>, res: Response) => {
  try {
    const data = await wellService.deleteWell(req.params.id, req.user);

    return successResponse(res, data, "Deleted", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const verify = async (req: Request<Params>, res: Response) => {
  try {
    const data = await wellService.verifyWell(req.params.id, req.user);

    return successResponse(res, data, "Well verified successfully", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};
