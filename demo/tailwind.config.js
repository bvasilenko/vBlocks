import vtheme from '@booga/vtheme/preset';
import { dslSafelist } from '@booga/vdsl';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [vtheme],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '../src/**/*.{ts,tsx}',
    './node_modules/@booga/vblocks/dist/**/*.{js,cjs}',
    './node_modules/@booga/vui/dist/**/*.{js,cjs}',
  ],
  // vBlocks/vUi build spacing + color classes at runtime via the DSL; the
  // content scan above cannot see them. Safelist the DSL's full class surface.
  safelist: [...dslSafelist],
};
