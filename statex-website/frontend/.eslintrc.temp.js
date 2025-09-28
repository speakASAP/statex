# ESLint Disable Rules for Testing A/B System
module.exports = {
  extends: ["next", "next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "no-unused-vars": "warn", 
    "no-console": "warn",
    "max-len": "warn",
    "react/no-unescaped-entities": "warn",
    "react/no-array-index-key": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "@next/next/no-img-element": "warn",
    "no-multiple-empty-lines": "warn",
    "react/self-closing-comp": "warn",
    "indent": "warn",
    "quotes": "warn"
  }
};
