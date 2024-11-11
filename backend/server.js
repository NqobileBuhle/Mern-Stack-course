import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from "./routes/products.routes.js";

dotenv.config();

const app = express();
const PORT=process.env.PORT || 5000;  //CONFIGURING THE FRONT END
app.use(express.json()); // Allows us to accept JSON data in the body
app.use("/api/products",productRoutes);


// Start server and connect to database
app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:'+ PORT);
});
