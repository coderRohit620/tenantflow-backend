// require("dotenv").config();

import {config} from "dotenv";
import { app } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";

// const app = require("./app");
config();
await connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Prisma DB connection failed !!!", err.message);
    process.exit(1);
  });


// ✅ Handle App Crashes
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});


// ✅ Handle Async Errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});


// ✅ Graceful Shutdown (Ctrl + C)
process.on("SIGINT", async () => {
  console.log("\n Shutting down server...");

  await disconnectDB();

  process.exit(0);
});
