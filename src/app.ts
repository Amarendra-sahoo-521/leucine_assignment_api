import express from "express";
import equipmentRouter from "./modules/Equipments/equipment.rout"
import cleaningRouter from "./modules/Cleaning/cleaning.rout"
import userRouter from "./modules/User/user.rout"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use("/api/equipments", equipmentRouter);
app.use("/api/cleaning", cleaningRouter);
app.use("/api/users", userRouter);

export default app;