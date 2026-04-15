import { Request, Response } from "express";
import * as businessService from "./business.service";
import { successResponse, errorResponse } from "../../utils/response";

type Params = {
  id: string;
};

export const create = async (req: Request, res: Response) => {
  try {
    const business = await businessService.createBusiness(req.body, req.user);

    return successResponse(res, business, "Business berhasil dibuat", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const findAll = async (req: Request, res: Response) => {
  const data = await businessService.getBusinesses(req.user);

  return successResponse(res, data, "Success", req.user);
};

export const findOne = async (req: Request<Params>, res: Response) => {
  try {
    const data = await businessService.getBusinessById(req.params.id, req.user);

    return successResponse(res, data, "Success", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const update = async (req: Request<Params>, res: Response) => {
  try {
    const data = await businessService.updateBusiness(
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
    const data = await businessService.deleteBusiness(req.params.id, req.user);

    return successResponse(res, data, "Deleted", req.user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";

    if (message === "Forbidden") {
      return errorResponse(res, message, 403);
    }

    if (message === "Business tidak ditemukan") {
      return errorResponse(res, message, 404);
    }

    return errorResponse(res, message, 400);
  }
};
