import importPlugin from "eslint-plugin-import";
import globals from "globals";
import js from "@eslint/js";

export default [
  // Base recommended config + custom rules for .es6 files
  js.configs.recommended,
  // Node/CommonJS globals for webpack config files
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.es6"],
    plugins: {
      import: importPlugin
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        log: "readonly"
      }
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".es6", ".json"]
        }
      }
    },
    rules: {
      indent: ["error", 2],
      "import/no-unresolved": "off",
      "import/extensions": "off"
    }
  }
];




