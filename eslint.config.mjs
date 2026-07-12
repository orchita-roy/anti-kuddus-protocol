import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const config = [{ ignores: [".next/**", ".next-build/**", "node_modules/**", "coverage/**", "playwright-report/**", "test-results/**"] }, ...compat.extends("next/core-web-vitals", "next/typescript"), { rules: { "@typescript-eslint/ban-ts-comment": "off", "@typescript-eslint/no-explicit-any": "off", "@typescript-eslint/triple-slash-reference": "off", "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }] } }];
export default config;
