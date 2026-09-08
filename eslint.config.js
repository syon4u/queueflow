
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  {
    ignores: [
      "dist",
      // Deno edge functions: URL imports and Deno globals, not the browser
      // Vite app this config describes. They carry 34 no-explicit-any/
      // no-case-declarations findings that are out of scope for the web
      // lint gate; lint them with `deno lint` from supabase/ instead.
      "supabase/functions",
    ],
  },
  {
    extends: [
      js.configs.recommended, 
      ...tseslint.configs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // eslint-plugin-jsx-a11y@6.10.2's flat-config preset predates the
      // current ESLint flat-config parserOptions shape and cannot be spread
      // into `extends` directly (see repo notes) — apply its rules here instead.
      ...jsxA11y.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
