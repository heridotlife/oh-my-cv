import { renovamen } from "@renovamen/eslint-config";
import vueAccessibility from "eslint-plugin-vuejs-accessibility";

export default renovamen({}, ...vueAccessibility.configs["flat/recommended"]);
