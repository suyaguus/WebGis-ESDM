import { Request, Response } from "express";
import * as companyService from "./company.service";
import { successResponse, errorResponse } from "../../utils/response";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.type";
import { MESSAGES } from "../../constants/message";

type Params = {
  id: string;
};

// CREATE
export const create = async (
  req: Request<{}, {}, CreateCompanyInput>,
  res: Response,
) => {
  try {
    const company = await companyService.createCompany(req.body, req.user!.id);

    return successResponse(res, company, MESSAGES.SUCCESS.CREATE);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

// GET ALL
export const findAll = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const companies = await companyService.getCompanies(req.user, {
      page: page as string | undefined,
      limit: limit as string | undefined,
    });

    return successResponse(res, companies, MESSAGES.SUCCESS.GET, req.user);
  } catch (err) {
    console.error("[Company.findAll] Error:", err);
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

// GET ONE
export const findOne = async (req: Request<Params>, res: Response) => {
  try {
    const company = await companyService.getCompanyById(
      req.params.id,
      req.user,
    );

    return successResponse(res, company, MESSAGES.SUCCESS.GET, req.user);
  } catch (err) {
    return errorResponse(
      res,
      err instanceof Error ? err.message : "Error",
      err instanceof Error && err.message === "Forbidden" ? 403 : 500,
    );
  }
};

// UPDATE
export const update = async (
  req: Request<Params, {}, UpdateCompanyInput>,
  res: Response,
) => {
  try {
    const company = await companyService.updateCompany(
      req.params.id,
      req.body,
      req.user,
    );

    return successResponse(res, company, MESSAGES.SUCCESS.UPDATE);
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};

// DEACTIVATE
export const deactivate = async (req: Request<Params>, res: Response) => {
  const company = await companyService.deactivateCompany(req.params.id);

  return successResponse(res, company, "Perusahaan dinonaktifkan");
};

// ACTIVATE
export const activate = async (req: Request<Params>, res: Response) => {
  const company = await companyService.activateCompany(req.params.id);

  return successResponse(res, company, "Perusahaan diaktifkan kembali");
};

// DELETE
export const remove = async (req: Request<Params>, res: Response) => {
  try {
    const deletedCompany = await companyService.deleteCompany(
      req.params.id,
      req.user,
    );

    return successResponse(
      res,
      {
        id: deletedCompany.id,
        name: deletedCompany.name,
        email: deletedCompany.email,
        type: deletedCompany.type,
      },
      MESSAGES.SUCCESS.DELETE,
      req.user,
    );
  } catch (err) {
    return errorResponse(res, err instanceof Error ? err.message : "Error");
  }
};
