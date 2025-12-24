import axe from "axe-core";

export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === "development") {
    // Run axe on initial load
    setTimeout(() => {
      axe.run().then((results) => {
        if (results.violations.length) {
          console.group(
            "%cAccessibility Violations",
            "color: red; font-weight: bold; font-size: 14px;"
          );
          results.violations.forEach((violation) => {
            console.log(
              `%c${violation.id}: %c${violation.help}`,
              "color: orange; font-weight: bold;",
              "color: inherit;"
            );
            violation.nodes.forEach((node: any) => {
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
      });
    }, 2000); // Delay to ensure hydration
  }
});
