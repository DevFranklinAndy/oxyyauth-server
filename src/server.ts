import express from "express";
import envConfig from "./configurations/envConfiguration.ts";
import dbConfig from "./configurations/databaseConfiguration.ts";
import appConfig from "./appConfig.ts";

const app = express();
const port: number = +envConfig.PORT || 5050;

appConfig(app);

const server = app.listen(port, () => {
  dbConfig();
  console.log(`Server is running on PORT: ${port}`);
});

process.on("uncaughtException", (error) =>
  console.error("uncaughtException:", error.name, error.message)
);

process.on("unhandledRejection", (error) => {
  if (error instanceof Error)
    console.error("unhandledRejection:", error.name, error.message);

  server.close(() => process.exit(1));
});
