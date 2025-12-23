// stories/button-group.stories.js

export default {
  title: 'Components/Button Group',
  tags: ['autodocs'],
};

const container = html => {
  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gap = '16px';
  wrap.style.padding = '16px';
  wrap.innerHTML = html;
  return wrap;
};

export const Vertical = {
  render: () =>
    container(`
      <button-group>
        <button-component title-attr="Go Ahead" start size="sm" variant="active-blue" active group-btn btn-text="Default Button"></button-component>
        <button-component title-attr="Go Ahead" variant="active-blue" size="sm" group-btn btn-text="Default Button"></button-component>
        <button-component title-attr="Go Ahead" variant="active-blue" disabled size="sm" group-btn end btn-text="Default This Button"></button-component>
      </button-group>
    `),
};

export const Horizontal = {
  render: () =>
    container(`
      <button-group vertical>
        <button-component title-attr="Go Ahead" start size="sm" variant="primary" vertical group-btn btn-text="Default Button"></button-component>
        <button-component title-attr="Go Ahead" variant="danger" size="sm" vertical group-btn btn-text="Default Button"></button-component>
        <button-component title-attr="Go Ahead" variant="success" size="sm" vertical group-btn end btn-text="Default This Button"></button-component>
      </button-group>
    `),
};
