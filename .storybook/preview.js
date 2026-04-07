// .storybook/preview.js
import { defineCustomElements } from '../loader';

defineCustomElements();

export default {
  parameters: {
    controls: { expanded: true },
    options: { storySort: { method: 'alphabetical', locales: 'en-US' } },
    a11y: { element: '#root' },
  },
};
