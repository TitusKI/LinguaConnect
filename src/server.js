import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

import cookieparser from "cookie-parser";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
// jwt parser
app.use(cookieparser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
  connectDB();
});
