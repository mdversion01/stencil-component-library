// stories/button-group.stories.js

export default {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: ['Button Group component allows grouping multiple buttons together.', ''].join('\n'),
      },
    },
  },

  argTypes: {
    vertical: { control: 'boolean', description: 'If true, stacks buttons vertically instead of horizontally.' },
  },

  args: {
    vertical: false,
  }

};

const container = html => {
  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gap = '16px';
  wrap.style.padding = '16px';
  wrap.innerHTML = html;
  return wrap;
};

export const Horizontal = {
  render: () =>
    container(`
      <button-group>
        <button-component title-attr="Go Ahead" start size="sm" variant="active-blue" active group-btn btn-text="Default Button"></button-component>
        <button-component title-attr="Go Ahead" variant="active-blue" size="sm" group-btn btn-text="Default Button"></button-component>
        <button-component title-attr="Go Ahead" variant="active-blue" disabled size="sm" group-btn end btn-text="Default This Button"></button-component>
      </button-group>
    `),
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal button group (the default) with active and disabled states.',
      },
    },
  },
};

export const Vertical = {
  render: () =>
    container(`
      <button-group vertical>
        <button-component title-attr="Go Ahead" start size="sm" variant="primary" vertical group-btn btn-text="Default Button"></button-component>
        <button-component title-attr="Go Ahead" variant="danger" size="sm" vertical group-btn btn-text="Default Button"></button-component>
        <button-component title-attr="Go Ahead" variant="success" size="sm" vertical group-btn end btn-text="Default This Button"></button-component>
      </button-group>
    `),
    parameters: {
    docs: {
      description: {
        story:
          'Vertical button group with different variants and states.',
      },
    },
  },
};
