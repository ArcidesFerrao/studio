import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 'any' é usado de forma intencional em utilitários genéricos
      // (crud-factory.ts, callbacks de auth) — não deve bloquear o build.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
