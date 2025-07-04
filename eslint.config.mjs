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
  {rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-expressions": [2, {
      "allowShortCircuit": true,
      "allowTernary": true,
    }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "none",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  },}
];

export default eslintConfig;
