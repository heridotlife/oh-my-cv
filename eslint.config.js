import { heridotlife } from "@heridotlife/eslint-config";
import vueAccessibility from "eslint-plugin-vuejs-accessibility";

export default heridotlife({}, ...vueAccessibility.configs["flat/recommended"]);
