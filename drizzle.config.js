import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./utils/schema.js*",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://MockInter_owner:e1SGc2smtxoY@ep-steep-bonus-a1sfy3qj.ap-southeast-1.aws.neon.tech/MockInter?sslmode=require',
  }
});
