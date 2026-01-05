// .storybook/preview.js
export default {
  parameters: {
    controls: { expanded: true },
    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'en-US',
      },
    },
    a11y: {
      element: '#root', // or '#storybook-root' if that’s your mount point
    },
  },
};

// ✅ Load the namespace ESM bundle directly from your repo (Vite serves it).
// This was your original, known-good pattern.
import '../dist/stencil-component-library/stencil-component-library.esm.js';

// ✅ Load your compiled CSS the same way (relative path).
import '../www/build/stencil-component-library.css';

