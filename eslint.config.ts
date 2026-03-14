import antfu from "@antfu/eslint-config";
import sonarjs from "eslint-plugin-sonarjs";

export default antfu(
  {
    typescript: true,
    vue: false,
    react: false,
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
    rules: {
      // Import sorting
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
        },
      ],
      "sort-keys": "off",

      // TypeScript
      "ts/no-non-null-assertion": "off",

      // Style
      "style/no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 0,
        },
      ],

      // Node.js globals
      "node/prefer-global/buffer": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      // JSDoc requirements for public APIs
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
      "jsdoc/require-description": "error",
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/no-types": "error",

      // SonarJS rules
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/cyclomatic-complexity": ["error", { threshold: 10 }],
      "sonarjs/nested-control-flow": ["error", { maximumNestingLevel: 4 }],
      "sonarjs/max-lines-per-function": ["error", { maximum: 200 }],
      "sonarjs/no-duplicate-string": ["error", { threshold: 3 }],
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "sonarjs/no-gratuitous-expressions": "error",
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-small-switch": "error",
      "sonarjs/prefer-single-boolean-return": "error",
      "sonarjs/prefer-immediate-return": "error",
      "sonarjs/prefer-object-literal": "error",
      "sonarjs/prefer-while": "error",
      "sonarjs/no-ignored-return": "error",
      "sonarjs/no-collection-size-mischeck": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-empty-collection": "error",
      "sonarjs/no-extra-arguments": "error",
      "sonarjs/no-use-of-empty-return-value": "error",
      "sonarjs/non-existent-operator": "error",
    },
    plugins: {
      sonarjs,
    },
  },
  {
    files: ["**/*.md"],
    rules: {
      "markdown/heading-increment": "off",
    },
  },
  {
    files: ["docs/**/*.md"],
    rules: {
      "markdown/heading-increment": "off",
    },
  },
);
