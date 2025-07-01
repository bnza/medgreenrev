import {execSync} from "child_process";
import dotenv from "dotenv";

dotenv.config();

const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL;
if (!apiBaseUrl) {
  console.error("NUXT_PUBLIC_API_BASE_URL is not defined in your .env file.");
  process.exit(1);
}

const schemaUrl = `${apiBaseUrl}/api/docs.jsonopenapi`;

console.log(`Fetching OpenAPI schema from: ${schemaUrl}`);

execSync(`openapi-typescript ${schemaUrl} --output types/openapi.d.ts`, {
  stdio: "inherit",
});
