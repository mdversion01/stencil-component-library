// src/components/svg/svg-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { SvgComponent } from './svg-component';

// Create a *fresh* svg vnode each time
const getSvgNode = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"></circle>
  </svg>
);

describe('svg-component', () => {
  it('renders with defaults and applies fill=currentColor (no width/height/aria by default)', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component>{getSvgNode()}</svg-component>,
    });

    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const svg = host.querySelector('svg')!;
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.hasAttribute('width')).toBe(false);
    expect(svg.hasAttribute('height')).toBe(false);
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
    expect(svg.hasAttribute('aria-label')).toBe(false);

    expect(page.root).toMatchInlineSnapshot(`
<svg-component>
  <template shadowrootmode="open">
    <slot></slot>
  </template>
  <svg fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"></circle>
  </svg>
</svg-component>
`);
  });

  it('forwards fill/width/height to the slotted <svg>', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => (
        <svg-component fill="#ff0000" width={32} height={16}>
          {getSvgNode()}
        </svg-component>
      ),
    });
    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const svg = host.querySelector('svg')!;
    expect(svg.getAttribute('fill')).toBe('#ff0000');
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('height')).toBe('16');

    expect(page.root).toMatchInlineSnapshot(`
<svg-component>
  <template shadowrootmode="open">
    <slot></slot>
  </template>
  <svg fill="#ff0000" height="16" viewBox="0 0 24 24" width="32">
    <circle cx="12" cy="12" r="9"></circle>
  </svg>
</svg-component>
`);
  });

  it('forwards ARIA props (svg-aria-hidden / svg-aria-label) and updates on change', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => (
        <svg-component svg-aria-hidden="true" svg-aria-label="Close">
          {getSvgNode()}
        </svg-component>
      ),
    });
    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const cmp = host as any;
    const svg = host.querySelector('svg')!;

    // initial
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('aria-label')).toBe('Close');

    // update to false + remove label
    cmp.svgAriaHidden = 'false';
    cmp.svgAriaLabel = '';
    await page.waitForChanges();

    expect(svg.getAttribute('aria-hidden')).toBe('false');
    expect(svg.hasAttribute('aria-label')).toBe(false);

    expect(page.root).toMatchInlineSnapshot(`
<svg-component svg-aria-hidden="true" svg-aria-label="Close">
  <template shadowrootmode="open">
    <slot></slot>
  </template>
  <svg aria-hidden="false" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"></circle>
  </svg>
</svg-component>
`);
  });

  it('wraps the first slotted SVG in a margin span (left=mr-1 / right=ml-1) and can unwrap', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component svg-margin="left">{getSvgNode()}</svg-component>,
    });
    await page.waitForChanges();

    const host = page.root as HTMLElement;

    // After "left" -> expect wrapper span.mr-1
    let span = host.querySelector('span') as HTMLSpanElement;
    let svg = host.querySelector('span > svg') as SVGElement;
    expect(span).not.toBeNull();
    expect(span.classList.contains('mr-1')).toBe(true);
    expect(svg).not.toBeNull();

    // Switch to "right" -> span should flip to ml-1
    (host as any).svgMargin = 'right';
    await page.waitForChanges();

    span = host.querySelector('span') as HTMLSpanElement;
    svg = host.querySelector('span > svg') as SVGElement;
    expect(span).not.toBeNull();
    expect(span.classList.contains('ml-1')).toBe(true);
    expect(svg).not.toBeNull();

    // Unset margin -> unwrap (svg becomes a direct child of host again)
    (host as any).svgMargin = '';
    await page.waitForChanges();

    const unwrappedSvg = host.firstElementChild as SVGElement;
    expect(unwrappedSvg?.tagName.toLowerCase()).toBe('svg');
    expect(host.querySelector('span')).toBeNull();

    expect(page.root).toMatchInlineSnapshot(`
<svg-component svg-margin="left">
  <template shadowrootmode="open">
    <slot></slot>
  </template>
  <svg fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"></circle>
  </svg>
</svg-component>
`);
  });
});
