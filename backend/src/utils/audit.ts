import prisma from "../config/prisma";

export type AuditAction =
  | "LOGIN"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "CREATE_USER"
  | "UPDATE_USER"
  | "DELETE_USER"
  | "ACTIVATE_USER"
  | "DEACTIVATE_USER"
  | "CREATE_COMPANY"
  | "UPDATE_COMPANY"
  | "DELETE_COMPANY"
  | "CREATE_SENSOR"
  | "UPDATE_SENSOR"
  | "DELETE_SENSOR"
  | "APPROVE_REPORT"
  | "REJECT_REPORT"
  | "CREATE_REPORT";

const SEVERITY_MAP: Record<AuditAction, string> = {
  LOGIN: "info",
  LOGIN_FAILED: "warning",
  LOGOUT: "info",
  CREATE_USER: "info",
  UPDATE_USER: "info",
  DELETE_USER: "critical",
  ACTIVATE_USER: "info",
  DEACTIVATE_USER: "warning",
  CREATE_COMPANY: "info",
  UPDATE_COMPANY: "info",
  DELETE_COMPANY: "critical",
  CREATE_SENSOR: "info",
  UPDATE_SENSOR: "info",
  DELETE_SENSOR: "critical",
  APPROVE_REPORT: "info",
  REJECT_REPORT: "warning",
  CREATE_REPORT: "info",
};

interface AuditParams {
  userId?: string;
  userName: string;
  action: AuditAction;
  target: string;
  ip?: string;
}

export async function saveAuditLog(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        userName: params.userName,
        action: params.action,
        target: params.target,
        ip: params.ip ?? null,
        severity: SEVERITY_MAP[params.action] ?? "info",
      },
    });
  } catch {
    // Audit failures should never break the main flow
  }
}
