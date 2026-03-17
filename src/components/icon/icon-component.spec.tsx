// src/components/icon/icon-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { IconComponent } from './icon-component';

describe('icon-component', () => {
  it('renders with default props (decorative icon)', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-check"></icon-component>`,
    });

    const iTag = page.root!.querySelector('i') as HTMLElement;
    expect(iTag).toBeTruthy();
    expect(iTag.getAttribute('class') || '').toContain('fa-check');

    // decorative defaults
    expect(iTag.getAttribute('aria-hidden')).toBe('true');
    expect(iTag.getAttribute('aria-label')).toBeNull();
    expect(iTag.getAttribute('role')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('renders with iconMargin left', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-user" icon-margin="left"></icon-component>`,
    });

    const iTag = page.root!.querySelector('i') as HTMLElement;
    expect(iTag.className).toContain('ms-1');
    expect(page.root).toMatchSnapshot();
  });

  it('renders with iconMargin right', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-user" icon-margin="right"></icon-component>`,
    });

    const iTag = page.root!.querySelector('i') as HTMLElement;
    expect(iTag.className).toContain('me-1');
    expect(page.root).toMatchSnapshot();
  });

  it('applies tokenIcon class', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-star" token-icon></icon-component>`,
    });

    const iTag = page.root!.querySelector('i') as HTMLElement;
    expect(iTag.className).toContain('token-icon');
    expect(page.root).toMatchSnapshot();
  });

  it('applies dynamic font-size and color', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-star" icon-size="24" color="red"></icon-component>`,
    });

    const iTag = page.root!.querySelector('i') as HTMLElement;
    const styleAttr = iTag.getAttribute('style') || '';

    // Stencil may serialize styles with/without spaces
    expect(styleAttr).toMatch(/font-size:\s*24px/i);
    expect(styleAttr).toMatch(/color:\s*red/i);

    expect(page.root).toMatchSnapshot();
  });

  it('meaningful icon: sets role="img", aria-label, and aria-hidden=false', async () => {
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-info" icon-aria-label="Information" icon-aria-hidden="false"></icon-component>`,
    });

    const iTag = page.root!.querySelector('i') as HTMLElement;

    expect(iTag.getAttribute('aria-label')).toBe('Information');
    expect(iTag.getAttribute('aria-hidden')).toBe('false');
    expect(iTag.getAttribute('role')).toBe('img');

    expect(page.root).toMatchSnapshot();
  });

  it('fail-safe: iconAriaHidden=false without label warns and falls back to decorative', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-info" icon-aria-hidden="false"></icon-component>`,
    });

    const iTag = page.root!.querySelector('i') as HTMLElement;

    // fallback to decorative
    expect(iTag.getAttribute('aria-hidden')).toBe('true');
    expect(iTag.getAttribute('aria-label')).toBeNull();
    expect(iTag.getAttribute('role')).toBeNull();

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();

    expect(page.root).toMatchSnapshot();
  });

  it('fail-safe: iconAriaHidden=false with whitespace label warns and falls back to decorative', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const page = await newSpecPage({
      components: [IconComponent],
      html: `<icon-component icon="fa-info" icon-aria-hidden="false" icon-aria-label="   "></icon-component>`,
    });

    const iTag = page.root!.querySelector('i') as HTMLElement;

    // fallback to decorative
    expect(iTag.getAttribute('aria-hidden')).toBe('true');
    expect(iTag.getAttribute('aria-label')).toBeNull();
    expect(iTag.getAttribute('role')).toBeNull();

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();

    expect(page.root).toMatchSnapshot();
  });
});
