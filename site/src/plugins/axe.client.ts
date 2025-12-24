import axe from "axe-core";
import type { NodeResult, Result } from "axe-core";

export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === "development") {
    // Run axe on initial load
    setTimeout(() => {
      axe
        .run()
        .then((results) => {
          if (results.violations.length) {
            console.group(
              "%cAccessibility Violations",
              "color: red; font-weight: bold; font-size: 14px;"
            );
            results.violations.forEach((violation: Result) => {
              console.log(
                `%c${violation.id}: %c${violation.help}`,
                "color: orange; font-weight: bold;",
                "color: inherit;"
              );
              violation.nodes.forEach((node: NodeResult) => {
                console.log(`Target: ${node.target}`);
                console.log(`HTML: ${node.html}`);
              });
            });
            console.groupEnd();
          } else {
            console.log(
              "%cAccessibility: No violations found",
              "color: green; font-weight: bold;"
            );
          }
        })
        .catch((error) => {
          console.error("Axe accessibility check failed:", error);
        });
    }, 2000); // Delay to ensure hydration
  }
});
