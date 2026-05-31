// Build-time config for the precompiled stylesheet (dist/styles.css).
// Scans this package's source AND @booga/vui's dist. Consumers running
// their own Tailwind pipeline should apply @booga/vtheme/preset directly.
import vtheme from "@booga/vtheme/preset";
import { dslSafelist } from "@booga/vdsl";

const TONES = ["ok", "warn", "bad", "info", "meta"];
const TONE_UTILITIES = TONES.flatMap((t) => [
  `bg-tone-${t}-bg`,
  `bg-tone-${t}-soft`,
  `text-tone-${t}-fg`,
  `border-tone-${t}-fg`,
  `border-tone-${t}-fg/25`,
  `border-tone-${t}-fg/40`,
]);

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
  //
  // Tone-* utilities (consumed by vUi 0.4.0's Kicker/Eyebrow/Pill primitives
  // and by vBlocks tone callouts) likewise live in vUi/dist .js as
  // tone-${name}-${slot} strings; safelist them so the precompiled CSS keeps
  // them even when tree-shaking strips unused class names.
  safelist: [...dslSafelist, ...TONE_UTILITIES],
};
