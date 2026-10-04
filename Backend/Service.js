import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from './Routes/Api.js';
import requestRoutes from './Routes/SubmitApi.js';
import verifyRoutes from './Routes/verifyApi.js';
import policyRoutes from './Routes/policyApi.js'
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes)
app.use('/api/req', requestRoutes)
app.use('/api/verify', verifyRoutes)
app.use('/api/policy',policyRoutes)


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected "))
  .catch(err => console.error(err));
app.listen(port, () => console.log(`Server running on port ${port}`));