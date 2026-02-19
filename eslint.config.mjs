import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "backend/**",
    "docs/**",
    "public/Ante Social_files/**",
    "build_output.txt",
    "tsc_output.txt",
    "tsconfig.tsbuildinfo",
  ]),
]);
