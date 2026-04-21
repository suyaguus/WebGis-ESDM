import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./modules/user/user.routes";
import reportRoutes from "./modules/report/report.routes";
import wellRourtes from "./modules/well/well.routes";
import companyRoutes from "./modules/company/company.routes";
import businessRoutes from "./modules/business/business.routes";
import { requestLogger } from "./utils/logger";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://web-gis-esdm.vercel.app",
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

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Web GIS API" });
});

export default app;
