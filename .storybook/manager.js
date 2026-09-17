// .storybook/manager.js
import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import './theme-toolbar';

addons.setConfig({
  theme: themes.dark,
});
