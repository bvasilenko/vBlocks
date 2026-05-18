// Build-time config for the precompiled stylesheet (dist/styles.css).
// Scans this package's source AND @booga/vui's dist. Consumers running
// their own Tailwind pipeline should apply @booga/vtheme/preset directly.
import vtheme from "@booga/vtheme/preset";
import { dslSafelist } from "@booga/vdsl";

export default {
  presets: [vtheme],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@booga/vui/dist/**/*.js",
  ],
  // The DSL builds spacing/display/flex class names at runtime via template
  // literals (`gap-${v}`), which the content scanner above cannot see. Without
  // this safelist the precompiled CSS omits most of the spacing scale and
  // DSL-authored blocks render with collapsed gaps and padding.
  safelist: [...dslSafelist],
};
