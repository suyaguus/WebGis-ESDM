import { Request, Response } from "express";
import * as reportService from "./report.service";
import { successResponse, errorResponse } from "../../utils/response";

type Params = { id: string };

export const create = async (req: Request, res: Response) => {
  try {
    const data = await reportService.createReport(req.body, req.user);

    return successResponse(res, data, "Report dibuat", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const findAll = async (req: Request, res: Response) => {
  const data = await reportService.getReports(req.user);

  return successResponse(res, data, "Success", req.user);
};

export const findOne = async (req: Request<Params>, res: Response) => {
  try {
    const data = await reportService.getReportById(req.params.id, req.user);

    return successResponse(res, data, "Success", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const approve = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const data = await reportService.approveReport(
      req.params.id,
      req.user
    );

    return successResponse(res, data, "Report disetujui", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const reject = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { reason } = req.body;

    const data = await reportService.rejectReport(
      req.params.id,
      reason,
      req.user
    );

    return successResponse(res, data, "Report ditolak", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};