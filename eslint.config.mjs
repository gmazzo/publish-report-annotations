import tsESLint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [...tsESLint.configs.recommended, eslintPluginPrettierRecommended];
