// src/components/divider/divider-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { DividerComponent } from './divider-component';

function find(root: HTMLElement, sel: string): HTMLElement | null {
  return root.querySelector(sel) as HTMLElement | null;
}

describe('divider-component', () => {
  it('renders horizontal divider by default (role + aria-orientation)', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component></divider-component>`,
    });

    const el = page.root as HTMLElement;
    expect(el).toBeTruthy();

    const divider = find(el, 'div.divider.divider-horizontal')!;
    expect(divider).toBeTruthy();
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');

    expect(page.root).toMatchSnapshot();
  });

  it('renders dashed horizontal divider (role + aria-orientation)', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component dashed></divider-component>`,
    });

    const el = page.root as HTMLElement;
    const divider = find(el, 'div.divider.divider-horizontal')!;
    expect(divider).toBeTruthy();
    expect(divider.className).toContain('divider-dashed');
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');

    expect(page.root).toMatchSnapshot();
  });

  it('renders vertical divider when direction="vertical" (role + aria-orientation)', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component direction="vertical"></divider-component>`,
    });

    const el = page.root as HTMLElement;
    const divider = find(el, 'div.divider.divider-vertical')!;
    expect(divider).toBeTruthy();
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('vertical');

    expect(page.root).toMatchSnapshot();
  });

  it('renders divider with centered text and provides aria-label (derived from slot) + aria-orientation', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component orientation="center">Center</divider-component>`,
    });

    const el = page.root as HTMLElement;
    const divider = find(el, 'div.divider.divider-horizontal.divider-with-text')!;
    expect(divider).toBeTruthy();
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');

    // With text: aria-label should exist (derived from slot text unless aria-label prop is set)
    expect((divider.getAttribute('aria-label') || '').trim()).toBe('Center');

    expect(page.root).toMatchSnapshot();
  });

  it('renders divider with left aligned text and margin override class', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component orientation="left" remove-orientation-margin="left">Left</divider-component>`,
    });

    const el = page.root as HTMLElement;
    const divider = find(el, 'div.divider.divider-horizontal.divider-with-text-left')!;
    expect(divider).toBeTruthy();

    expect(divider.className).toContain('divider-no-default-orientation-margin-left');
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');

    // With text: aria-label should exist
    expect((divider.getAttribute('aria-label') || '').trim()).toBe('Left');

    expect(page.root).toMatchSnapshot();
  });

  it('renders divider with custom styles in text span and keeps aria-label', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component orientation="center" styles="color: red; font-weight: bold;">Styled</divider-component>`,
    });

    const el = page.root as HTMLElement;
    const divider = find(el, 'div.divider.divider-horizontal.divider-with-text')!;
    expect(divider).toBeTruthy();

    const span = find(el, 'span.divider-inner-text')!;
    expect(span).toBeTruthy();
    expect(span.getAttribute('style') || '').toContain('color: red');
    expect(span.getAttribute('style') || '').toContain('font-weight: bold');

    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    expect((divider.getAttribute('aria-label') || '').trim()).toBe('Styled');

    expect(page.root).toMatchSnapshot();
  });

  it('uses explicit aria-label prop (attribute) when provided (text variant)', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component orientation="center" aria-label="Section break">Center</divider-component>`,
    });

    const el = page.root as HTMLElement;
    const divider = find(el, 'div.divider.divider-horizontal.divider-with-text')!;
    expect(divider).toBeTruthy();

    // Explicit aria-label should override derived slot text
    expect((divider.getAttribute('aria-label') || '').trim()).toBe('Section break');
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');

    expect(page.root).toMatchSnapshot();
  });
});
