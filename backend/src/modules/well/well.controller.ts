import { Request, Response } from "express";
import * as wellService from "./well.service";
import { successResponse, errorResponse } from "../../utils/response";

type Params = { id: string };

export const create = async (req: Request, res: Response) => {
  try {
    console.log(
      "[Well.create] Request body:",
      JSON.stringify(req.body, null, 2),
    );
    console.log("[Well.create] User:", req.user);
    const data = await wellService.createWell(req.body, req.user);

    return successResponse(res, data, "Well berhasil dibuat", req.user);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Error";
    console.error("[Well.create] Error:", errorMessage, err);
    return errorResponse(res, errorMessage);
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, status } = req.query;
    const data = await wellService.getWells(
      req.user,
      {
        page: page as string | undefined,
        limit: limit as string | undefined,
      },
      status as string | undefined,
    );

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

export const getPending = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const data = await wellService.getPendingWells(req.user, {
      page: page as string | undefined,
      limit: limit as string | undefined,
    });

    return successResponse(res, data, "Pending wells retrieved", req.user);
  } catch (err) {
    console.error("[Well.getPending] Error:", err);
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const approve = async (req: Request<Params>, res: Response) => {
  try {
    const data = await wellService.approvePendingWell(req.params.id, req.user);

    return successResponse(
      res,
      data,
      "Well submission approved successfully",
      req.user,
    );
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const reject = async (req: Request<Params>, res: Response) => {
  try {
    const { reason = "No reason provided" } = req.body;
    const data = await wellService.rejectPendingWell(
      req.params.id,
      reason,
      req.user,
    );

    return successResponse(
      res,
      data,
      "Well submission rejected successfully",
      req.user,
    );
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const process = async (req: Request<Params>, res: Response) => {
  try {
    const data = await wellService.processWell(req.params.id, req.user);

    return successResponse(
      res,
      data,
      "Well sent to supervisor for review",
      req.user,
    );
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const getSupervisorWells = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const data = await wellService.getSupervisorWells(req.user, {
      page: page as string | undefined,
      limit: limit as string | undefined,
    });

    return successResponse(res, data, "Supervisor wells retrieved", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const review = async (req: Request<Params>, res: Response) => {
  try {
    const data = await wellService.reviewWell(req.params.id, req.user);

    return successResponse(res, data, "Well reviewed and sent back to super admin", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const flag = async (req: Request<Params>, res: Response) => {
  try {
    const { note = "Data tidak sesuai" } = req.body;
    const data = await wellService.flagWell(req.params.id, note, req.user);

    return successResponse(res, data, "Laporan ketidaksesuaian berhasil dikirim", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};
