import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./modules/user/user.routes";
import reportRoutes from "./modules/report/report.routes";
import wellRourtes from "./modules/well/well.routes";
import companyRoutes from "./modules/company/company.routes";
import businessRoutes from "./modules/business/business.routes";
import auditRoutes from "./modules/audit/audit.routes";
import kadisReportRoutes from "./modules/kadis-report/kadis-report.routes";
import { requestLogger } from "./utils/logger";
import prisma from "./config/prisma";
import { WELL_SELECT_MINIMAL } from "./constants/well/well.select";

const app = express();

// // Tambahkan ini sebelum semua app.use() lainnya
app.options("/{*path}", cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://web-gis-esdm-w192.vercel.app",
    "https://web-gis-esdm-gamma.vercel.app",
  ],
  credentials: true,
}));


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://web-gis-esdm-w192.vercel.app",
      "https://web-gis-esdm-gamma.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(requestLogger);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/wells", wellRourtes);
app.use("/api/companies", companyRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/kadis-reports", kadisReportRoutes);

// Public endpoint — no auth required, returns approved wells for the landing page map
app.get("/api/public/wells", async (req, res) => {
  try {
    const wells = await prisma.well.findMany({
      where: { status: "approved", isActive: true },
      select: WELL_SELECT_MINIMAL,
      orderBy: { updatedAt: "desc" },
      take: 500,
    });
    res.json({ success: true, data: wells });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error" });
  }
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Web GIS API" });
});

export default app;
