import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import db from "./src/config/db.js";
import router from "./src/routes/auth.routes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import categoryRoutes from "./src/routes/category.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
db();


const app = express();
app.use(cors());
app.use(express.json());

// Mount auth routes
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", router);
app.use("/api/transactions", transactionRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});