import { connect } from "mongoose";
import envConfig from "./envConfiguration.ts";

const dbConfig = async () => {
  try {
    const db = await connect(envConfig.DATABASE_URI);
    console.log(`Database is connected to HOST: ${db.connection.host}`);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
};

export default dbConfig;
