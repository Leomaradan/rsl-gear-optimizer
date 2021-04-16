module.exports = {
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
    "plugin:web/all",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",

        ecmaVersion: 2018,

        sourceType: "module",
      },
      rules: {
        "@typescript-eslint/adjacent-overload-signatures": "warn",
        "@typescript-eslint/ban-types": [
          "warn",
          {
            extendDefaults: false, // (the complete list is in this file)
            types: {
              Boolean: {
                fixWith: "boolean",
                message: 'Use "boolean" instead',
              },
              Function: {
                message: [
                  'The "Function" type accepts any function-like value.',
                  "It provides no type safety when calling the function, which can be a common source of bugs.",
                  'It also accepts things like class declarations, which will throw at runtime as they will not be called with "new".',
                  "If you are expecting the function to accept certain arguments, you should explicitly define the function shape.",
                ].join("\n"),
              },
              Number: {
                fixWith: "number",
                message: 'Use "number" instead',
              },
              Object: {
                message:
                  'Use "object" instead, or else define a proper TypeScript type:',
              },
              String: {
                fixWith: "string",
                message: 'Use "string" instead',
              },
              Symbol: {
                fixWith: "symbol",
                message: 'Use "symbol" instead',
              },
              "{}": {
                message: [
                  '"{}" actually means "any non-nullish value".',
                  '- If you want a type meaning "any object", you probably want "Record<string, unknown>" instead.',
                  '- If you want a type meaning "any value", you probably want "unknown" instead.',
                ].join("\n"),
              },
            },
          },
        ],

        "@typescript-eslint/consistent-type-assertions": "warn",

        "@typescript-eslint/consistent-type-definitions": "warn",

        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowExpressions: true,
            allowHigherOrderFunctions: false,
            allowTypedFunctionExpressions: true,
          },
        ],

        "@typescript-eslint/explicit-member-accessibility": "warn",

        "@typescript-eslint/member-ordering": [
          "warn",
          {
            classes: ["field", "constructor", "method"],
            default: "never",
          },
        ],

        "@typescript-eslint/no-array-constructor": "warn",

        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-floating-promises": "error",

        "@typescript-eslint/no-for-in-array": "error",

        "@typescript-eslint/no-misused-new": "error",

        "@typescript-eslint/no-namespace": [
          "warn",
          {
            // Discourage "namespace" in .ts and .tsx files
            allowDeclarations: false,

            // Allow it in .d.ts files that describe legacy libraries
            allowDefinitionFiles: false,
          },
        ],

        "@typescript-eslint/no-parameter-properties": "warn",

        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            vars: "all",

            args: "none",
          },
        ],

        "@typescript-eslint/no-use-before-define": [
          "error",
          {
            classes: true,
            functions: false,
            variables: true,

            // TypeScript extensions

            enums: true,
            typedefs: true,
            // ignoreTypeReferences: true
          },
        ],
        complexity: "warn",
        "default-case": "warn",
        "import/first": "warn",
        "import/newline-after-import": "warn",
        "import/no-absolute-path": "warn",
        "import/no-amd": "warn",
        "import/no-commonjs": "warn",
        "import/no-cycle": "warn", // This rule is heavy on CPU!
        "import/no-deprecated": "warn",
        "import/no-dynamic-require": "warn",
        "import/no-mutable-exports": "warn",
        "import/no-named-default": "warn",
        "import/no-nodejs-modules": "warn",
        "import/no-self-import": "warn",
        "import/no-unassigned-import": "warn",
        "import/no-useless-path-segments": "warn",
        "import/order": [
          "warn",
          {
            alphabetize: { order: "asc" },
            groups: [
              ["builtin", "external"],
              "internal",
              "parent",
              ["sibling", "index"],
              "object",
            ],
            "newlines-between": "always",
          },
        ],
        "import/prefer-default-export": "warn",
        "import/unambiguous": "warn",
        "new-parens": "warn",
        "no-bitwise": "warn",
        "no-console": "warn",
        "no-magic-numbers": [
          "warn",
          {
            detectObjects: true,
            ignore: [-1, 0, 1],
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
          },
        ],
        "no-redeclare": "warn",
        "no-shadow": "warn",
        "no-unused-vars": "off",
        "no-void": "off",
        "object-shorthand": "warn",
        "one-var": ["warn", "never"],
        "prefer-template": "warn",
        radix: "warn",
        "react/jsx-no-bind": "warn",
        "react/jsx-no-literals": [
          "warn",
          { allowedStrings: ["(", ")"], ignoreProps: false },
        ],
        "react/react-in-jsx-scope": "off",
        "spaced-comment": ["warn", "always", { markers: ["/"] }],
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-magic-numbers": "off",
      },
    },
  ],
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "eslint-plugin-promise",
    "only-warn",
    "react",
    "jest",
    "jsdoc",
    "only-warn",
    "sonarjs",
  ],
  reportUnusedDisableDirectives: true,
  rules: {
    "sonarjs/cognitive-complexity": "off",
    "sonarjs/max-switch-cases": "off",
  },
};
