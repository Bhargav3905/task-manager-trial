import "dotenv/config";
import { Pool } from "pg";
import { databaseUrl } from "../utils/env.js";

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;