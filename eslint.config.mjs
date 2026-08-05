import { FlatCompat } from "@eslint/eslintrc";
import babelParser from "@babel/eslint-parser";
import importPlugin from "eslint-plugin-import";
import jest from "eslint-plugin-jest";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  resolvePluginsRelativeTo: import.meta.dirname,
});

export default [
  // Ignore patterns
  {
    ignores: [
      "build/",
      "node_modules/",
      "src/main/resources/assets/",
      "src/main/resources/lib/moment/",
      ".idea/",
      ".gradle/",
      ".DS_Store",
      "coverage/",
      ".eslintcache",
      "eslint.config.mjs",
      "src/frontend/eslint.config.mjs"
    ]
  },
  {
    files: ["**/*.{js,es6}"],
    plugins: {
      import: importPlugin,
      jest
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: babelParser,
      globals: {
        require: "writable",
        log: "writable",
        exports: "writable",
        resolve: "writable",
        app: "writable",
        fetch: "readonly",
        document: "readonly",
        window: "readonly",
        __: "writable"
      }
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [
            ".js",
            ".jsx",
            ".es6",
            ".ts",
            ".tsx",
            ".json"
          ]
        }
      }
    },
    rules: {
      "import/extensions": [
        "error",
        {
          js: "never",
          mjs: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
          es6: "never"
        }
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true
        }
      ],
      indent: [
        "error",
        2,
        {
          SwitchCase: 1
        }
      ],
      "linebreak-style": [
        "error",
        "unix"
      ],
      quotes: [
        "error",
        "double"
      ],
      semi: [
        "error",
        "always"
      ],
      "comma-dangle": [
        "error",
        {
          arrays: "never",
          objects: "never",
          imports: "never",
          exports: "never",
          functions: "never"
        }
      ],
      "no-cond-assign": [
        "error",
        "always"
      ],
      "arrow-parens": "off",
      "no-use-before-define": "off",
      "no-console": "off",
      "global-require": "off",
      "import/no-unresolved": "off",
      "import/no-absolute-path": "off",
      "no-underscore-dangle": "off",
      "object-shorthand": "off",
      "prefer-destructuring": "off",
      radix: [
        "error",
        "as-needed"
      ],
      "no-plusplus": "off",
      "max-len": "off",
      "func-names": "off"
    }
  },
  // Override for HTML/FTL/XML files
  {
    files: ["**/*.html", "**/*.ftl", "**/*.xml"],
    rules: {
      "max-len": "off"
    }
  }
];








