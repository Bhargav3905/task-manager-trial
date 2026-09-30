import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export { databaseUrl, jwtSecret };