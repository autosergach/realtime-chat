module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  rules: {
    "react/react-in-jsx-scope": "off"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  ignorePatterns: ["node_modules", "dist", "coverage", "**/*.d.ts"],
  overrides: [
    {
      files: ["backend/**/*.ts"],
      rules: {
        "import/no-unresolved": "off"
      },
      env: {
        node: true
      }
    },
    {
      files: ["frontend/**/*.ts", "frontend/**/*.tsx"],
      rules: {
        "import/no-unresolved": "off"
      },
      env: {
        browser: true
      }
    }
  ]
};
