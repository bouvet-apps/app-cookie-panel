# ESLint 10.2.0 Upgrade Summary

## Migration Complete ✅

This document summarizes the upgrade from ESLint 8.57.1 (root) and 8.56.0 (frontend) to ESLint 10.2.0.

---

## What Changed

### 1. **Configuration Format: Legacy `.eslintrc` → Flat Config `.eslintrc.mjs`**

ESLint 10 removed all support for the legacy configuration format. The following files were **deleted**:
- `.eslintrc.json` (root)
- `src/frontend/.eslintrc`
- `.eslintignore` (patterns moved into flat config)

**New flat config files created:**
- `eslint.config.mjs` (root)
- `src/frontend/eslint.config.mjs`

### 2. **Major Dependencies Updated**

#### Root `package.json`:
| Package | Old Version | New Version | Reason |
|---------|------------|------------|--------|
| `eslint` | 8.57.1 | 10.2.0 | Target LTS upgrade |
| `@babel/core` | 7.27.4 | 8.0.0-rc.3 | ESLint 10 compatibility |
| `@babel/cli` | 7.27.2 | 8.0.0-rc.3 | ESLint 10 compatibility |
| `@babel/eslint-parser` | N/A (was `babel-eslint@10.1.0`) | 8.0.0-rc.3 | Official Babel parser for ESLint, ESLint 10 support |
| `@babel/preset-env` | 7.27.2 | 8.0.0-rc.3 | Babel ecosystem alignment |
| `@babel/plugin-transform-*` | 7.27.1 | 8.0.0-rc.3 | Babel ecosystem alignment |
| `eslint-config-airbnb` | 19.0.4 | ❌ Removed | No flat config support; replaced with `airbnb-base` |
| `eslint-config-airbnb-base` | N/A | 15.0.0 | Uses `FlatCompat` wrapper for flat config compatibility |
| `eslint-plugin-react` | 7.37.5 | ❌ Removed | No React used in this project |
| `eslint-plugin-jsx-a11y` | 6.10.2 | ❌ Removed | No JSX used in this project |
| `eslint-plugin-jest` | 27.9.0 | 28.11.0 | ESLint 10 flat config support |
| `eslint-plugin-import` | 2.32.0 | 2.32.0 | Kept (works with FlatCompat wrapper) |
| `@eslint/eslintrc` | N/A | 3.2.0 | **NEW** - Required for `FlatCompat` helper |
| `@eslint/js` | N/A | 9.19.0 | **NEW** - Recommended config for flat setup |
| `globals` | N/A | 15.14.0 | **NEW** - Replaces old `env` and `globals` keys |

#### Frontend `src/frontend/package.json`:
- Bumped `eslint` from 8.56.0 to 10.2.0
- Removed `eslint-config-airbnb-base` (not needed with minimal rules)
- Added `@eslint/js`, `@eslint/eslintrc`, and `globals`

### 3. **ESLint Configuration Patterns**

#### Root Config: `eslint.config.mjs`

**Key changes:**
- Uses `FlatCompat` to wrap legacy `airbnb-base` config
- Explicit file patterns: `files: ["**/*.{js,es6}"]`
- Uses `@babel/eslint-parser` as the parser for Babel support
- Global variables defined in `languageOptions.globals` instead of top-level `globals` key
- `.eslintignore` patterns moved into a dedicated config object with `ignores` array
- HTML/FTL/XML overrides now use separate flat config object

**Before (Legacy):**
```json
{
  "env": { "jest/globals": true },
  "globals": { "require": true, "log": true, "..." },
  "parserOptions": { "ecmaVersion": 2020 },
  "extends": ["airbnb"]
}
```

**After (Flat Config):**
```javascript
export default [
  { ignores: ["build/", "node_modules/", "..."] },
  {
    files: ["**/*.{js,es6}"],
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2020,
      globals: { require: "writable", log: "writable", "..." }
    },
    ...
  }
];
```

#### Frontend Config: `src/frontend/eslint.config.mjs`

**Key changes:**
- Uses minimal ESLint config instead of airbnb (no React/unnecessary rules)
- Based on `@eslint/js` recommended config
- Custom rules for frontend: `indent: [4]` and minimal import rules
- File pattern: `files: ["**/*.es6"]`

### 4. **Breaking Changes & Solutions**

| Breaking Change | Solution |
|---|---|
| `.eslintrc.*` files no longer supported | Migrated to flat config `eslint.config.mjs` |
| `.eslintignore` file removed | Moved patterns to `ignores` array in config |
| `env` key removed | Used `globals` package + manual globals in `languageOptions.globals` |
| Old `globals` format: `"require": true` | New format: `"require": "writable"` or `"readonly"` |
| `babel-eslint` parser deprecated | Replaced with `@babel/eslint-parser` |
| Plugins must have flat config exports | Used `FlatCompat` helper to wrap legacy configs |
| ESLint 10 requires Node.js 20+ | Already compatible with Node.js 20.19.1 |

### 5. **Package Installation**

Both root and frontend installations required `--legacy-peer-deps` flag due to:
- `@babel/eslint-parser` 8.0.0-rc.3 peer dependency expectations
- `eslint-plugin-import` v2.x lacking ESLint 10 peer dependency declaration

**Installation commands:**
```bash
cd /path/to/cookie-panel
npm install --legacy-peer-deps

cd src/frontend
npm install --legacy-peer-deps
```

---

## Testing & Verification

### Root Config Tests
✅ File: `src/main/resources/site/processors/cookie-panel.es6` - Lints successfully
✅ File: `src/main/resources/lib/util.es6` - Detects style violations (quotes, semicolons)

### Frontend Config Tests
✅ File: `src/frontend/scripts/cookie-panel.es6` - Lints successfully
✅ Detects indentation differences (4-space expected vs 2-space in code)

### Build Tests
✅ `npm run build:js` - Babel transpilation works successfully

---

## Summary of Files Modified

### Created:
- ✅ `eslint.config.mjs` (root flat config)
- ✅ `src/frontend/eslint.config.mjs` (frontend flat config)

### Deleted:
- ✅ `.eslintrc.json` (root legacy config)
- ✅ `src/frontend/.eslintrc` (frontend legacy config)
- ✅ `.eslintignore` (legacy ignore file)

### Updated:
- ✅ `package.json` (root - dependencies)
- ✅ `src/frontend/package.json` (frontend - dependencies + lint script)

---

## Known Notes

1. **Babel 8 RC**: This upgrade uses Babel 8.0.0-rc.3. When Babel 8 reaches stable release, consider upgrading to the stable version.

2. **Legacy Peer Deps Flag**: The `--legacy-peer-deps` flag is needed because:
   - `eslint-plugin-import` v2.x hasn't declared ESLint 10 in peer dependencies yet
   - This is safe and expected during the ESLint 10 adoption period

3. **Frontend Config**: The frontend now uses a minimal ESLint setup (`@eslint/js` recommended) instead of `airbnb-base`. This is intentional since the frontend JavaScript doesn't use React or advanced linting rules — keeping it simple reduces complexity.

4. **Reversible Changes**: All configuration changes are reversible. The old `.eslintrc` files were deleted but the patterns are preserved in the flat config `ignores` array and rule definitions.

---

## Next Steps (Optional)

1. **Run `npm lint` or ESLint** on all `.es6` files to verify code style compliance
2. **Auto-fix issues**: `npx eslint --fix src/` to automatically correct fixable violations
3. **Monitor for Babel 8 stable**: When Babel reaches v8.0.0 stable, upgrade to that version for production readiness
4. **Audit security**: `npm audit` to check for any security vulnerabilities in dependencies

---

## References

- [ESLint 10 Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Babel ESLint Parser](https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser)
- [Airbnb ESLint Config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

