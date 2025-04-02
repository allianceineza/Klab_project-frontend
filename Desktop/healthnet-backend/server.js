import express from 'express';
import mongoose from 'mongoose';
import mainRouter from './routes/indexRouting.js';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();
const db_port = process.env.PORT || 3000;

// Construct MongoDB URI properly
const dbUri = process.env.MONGODB_URI || "mongodb+srv://alliancegiseleineza:qyDaGv8A2veMtsfl@cluster0.0hhji.mongodb.net/health_net?retryWrites=true&w=majority";

// Express Setup
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());
app.use("/", mainRouter);

// Enhanced MongoDB Connection with More Detailed Error Handling
const connectWithRetry = async (retries = 3) => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("✅ Connected to MongoDB");
    
    app.listen(db_port, () => {
      console.log(`🚀 Server running at http://localhost:${db_port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectWithRetry(retries - 1), 3000);
    } else {
      console.error("Failed to connect to MongoDB after multiple attempts.");
      process.exit(1);
    }
  }
};

// Set up mongoose configurations
mongoose.set("strictQuery", false);

// Initiate connection
connectWithRetry();

// Optional: Add global error handlers for mongoose
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Lost MongoDB connection...');
});