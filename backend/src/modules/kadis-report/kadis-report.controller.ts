import { Request, Response } from "express";
import * as service from "./kadis-report.service";
import { successResponse, errorResponse } from "../../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const { title, companyId, companyName, totalWells, avgWaterLevel, notes, pdfContent } =
      req.body ?? {};

    if (!title || !companyName || totalWells === undefined) {
      return errorResponse(res, "title, companyName, dan totalWells wajib diisi", 400);
    }

    const data = await service.createKadisReport(
      { title, companyId, companyName, totalWells, avgWaterLevel, notes, pdfContent },
      req.user,
    );
    return successResponse(res, data, "Laporan berhasil dikirim ke Kadis", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const data = await service.getKadisReports();
    return successResponse(res, data, "Success", req.user);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};
