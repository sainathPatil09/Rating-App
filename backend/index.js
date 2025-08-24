
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from './routes/adminRoutes.js'
import storeRoutes from './routes/storeRoutes.js'
import ownerRoutes from './routes/ownerRoutes.js'
import accountRoutes from './routes/accountRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const frontend_url = process.env.FRONTEND_URL;
app.use(cors({
  origin: frontend_url, // frontend origin
  credentials: true      // if you need cookies/auth headers
}));

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);


app.use("/api/stores", storeRoutes);

app.use("/api/owners", ownerRoutes);

app.use("/api/account", accountRoutes);

app.use("/api/ok", (req, res) => {
  res.send("Everything is working");
}); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
