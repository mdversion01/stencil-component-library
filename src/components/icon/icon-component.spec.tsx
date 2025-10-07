// src/components/icon/icon-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { IconComponent } from './icon-component';

describe('icon-component', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-check"></icon-component>`,
    });

    const iTag = page.root.querySelector('i');
    expect(iTag).toBeTruthy();
    expect(iTag.getAttribute('class')).toContain('fa-check');
    expect(iTag.getAttribute('aria-hidden')).toBe('true');
    expect(iTag.getAttribute('aria-label')).toBeNull();
    expect(page.root).toMatchSnapshot();
  });

  it('renders with iconMargin left', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-user" icon-margin="left"></icon-component>`,
    });

    const iTag = page.root.querySelector('i');
    expect(iTag.className).toContain('ms-1');
    expect(page.root).toMatchSnapshot();
  });

  it('renders with iconMargin right', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-user" icon-margin="right"></icon-component>`,
    });

    const iTag = page.root.querySelector('i');
    expect(iTag.className).toContain('me-1');
    expect(page.root).toMatchSnapshot();
  });

  it('applies tokenIcon class', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-star" token-icon></icon-component>`,
    });

    const iTag = page.root.querySelector('i');
    expect(iTag.className).toContain('token-icon');
    expect(page.root).toMatchSnapshot();
  });

  it('applies dynamic font-size and color', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-star" icon-size="24" color="red"></icon-component>`,
    });

    const iTag = page.root.querySelector('i');
    const styleAttr = iTag.getAttribute('style') || '';
    expect(styleAttr).toContain('font-size: 24px');
    expect(styleAttr).toContain('color: red');
    expect(page.root).toMatchSnapshot();
  });

  it('sets custom aria-label and aria-hidden=false', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-info" icon-aria-label="Information" icon-aria-hidden="false"></icon-component>`,
    });

    const iTag = page.root.querySelector('i');
    expect(iTag.getAttribute('aria-label')).toBe('Information');
    expect(iTag.getAttribute('aria-hidden')).toBe('false');
    expect(page.root).toMatchSnapshot();
  });
});
