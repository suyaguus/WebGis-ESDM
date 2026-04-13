import express from "express";
import authRoutes from "./routes/auth.route";
import userRoutes from "./modules/user/user.routes";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
