import express from "express";
import equipmentRouter from "./modules/Equipments/equipment.rout"
import cleaningRouter from "./modules/Cleaning/cleaning.rout"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use("/api/equipments", equipmentRouter);
app.use("/api/cleaning", cleaningRouter);

export default app;