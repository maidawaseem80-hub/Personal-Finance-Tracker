// import express from "express";
// import cors from "cors";
// import * as dotenv from "dotenv";
// dotenv.config();
// import db from "./config/db.js";
// import authRoutes from "./routes/auth.routes.js";
// db();

// const app = express();
// app.use("/api/auth", authRoutes);
// app.use(cors());
// app.use(express.json());
// app.listen(5000, () => {
//     console.log("Server is running");
// })

import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import db from "./config/db.js";
import router from "./routes/auth.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import categoryRoutes from "./routes/category.routes.js";

db();


const app = express();
app.use(cors());
app.use(express.json());

// Mount auth routes
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", router);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});