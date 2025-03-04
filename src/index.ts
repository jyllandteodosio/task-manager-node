import app from "./app.ts";
import dotenv from "dotenv";
import { connectDB, client } from "./db.ts";  

import https from "https";
import fs from "fs";

dotenv.config();

// console.log({home: process.env.HOME});

const httpsOptions = {
  key: fs.readFileSync(`${process.env.HOME}/localhost-key.pem`),
  cert: fs.readFileSync(`${process.env.HOME}/localhost.pem`),
};

const startServer = async () => {
  try { 
    await connectDB();

    const PORT = process.env.PORT || 3000;

    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`> Secure server running on ${PORT}`);
    });
  } catch (error: any) {
    console.error("Error starting server:", error);
  }
};

process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await client.close(); 
  console.log("MongoDB Disconnected");
  process.exit(0);
});

startServer();
