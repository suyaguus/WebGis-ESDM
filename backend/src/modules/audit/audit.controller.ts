import { Request, Response } from "express";
import prisma from "../../config/prisma";

const LIMIT = 5;

export const findAll = async (req: Request, res: Response) => {
  try {
    const { severity, search, days, page } = req.query;

    const daysNum = days ? parseInt(days as string) : 30;
    const pageNum = Math.max(1, parseInt((page as string) || "1"));
    const skip = (pageNum - 1) * LIMIT;

    const since = new Date();
    since.setDate(since.getDate() - daysNum);

    const where = {
      createdAt: { gte: since },
      ...(severity && severity !== "all"
        ? { severity: severity as string }
        : {}),
      ...(search
        ? {
            OR: [
              {
                userName: {
                  contains: search as string,
                  mode: "insensitive" as const,
                },
              },
              {
                action: {
                  contains: search as string,
                  mode: "insensitive" as const,
                },
              },
              {
                target: {
                  contains: search as string,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: LIMIT,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return res.json({
      success: true,
      message: "Audit log berhasil diambil",
      data: logs,
      metadata: {
        total,
        page: pageNum,
        limit: LIMIT,
        totalPages: Math.ceil(total / LIMIT),
      },
    });
  } catch (err) {
    console.error("[AUDIT] findAll error:", err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
