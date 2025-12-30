// // .storybook/preview.js
// export default {
//   parameters: { controls: { expanded: true } },
// };
// // No imports. No CSS. No loader.
// FILE: .storybook/preview.js
// Register Stencil elements; keep CSS off until things render.
// export default { parameters: { controls: { expanded: true } } };

// import('../loader')
//   .then(m => m?.defineCustomElements?.())
//   .then(() => console.info('[storybook] Stencil defineCustomElements OK'))
//   .catch(e => console.error('[storybook] loader import failed', e));

// // Once stories render, you can enable your stylesheet:
// import '../www/build/stencil-component-library.css';

export default {
  parameters: {
    controls: { expanded: true },
    a11y: {
      element: '#root', // or '#storybook-root' depending on your setup
    },
  },
};

// ✅ Load the namespace ESM bundle. No setAssetPath needed.
import '/dist/stencil-component-library/stencil-component-library.esm.js';

// Then your library CSS (it may reference /assets or /webfonts)
import '../www/build/stencil-component-library.css';
