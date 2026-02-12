// src/components/svg/svg-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { SvgComponent } from './svg-component';

describe('svg-component', () => {
  it('renders with defaults (fill/currentColor, width/height=24, viewBox default, path default injected) and no aria by default', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component></svg-component>,
    });

    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const svg = host.querySelector('svg') as SVGSVGElement;

    expect(svg).not.toBeNull();
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
    expect(svg.getAttribute('viewBox')).toBe('0 0 640 640');

    expect(svg.getAttribute('aria-hidden')).toBeNull();
    expect(svg.getAttribute('aria-label')).toBeNull();
    expect(svg.getAttribute('role')).toBeNull();

    expect(svg.style.marginLeft).toBe('');
    expect(svg.style.marginRight).toBe('');

    // default path is injected when path is empty
    expect(svg.querySelector('path')).not.toBeNull();

    expect(page.root).toMatchInlineSnapshot(`
<svg-component>
  <svg fill="currentColor" height="24" viewBox="0 0 640 640" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"></path>
  </svg>
</svg-component>
`);
  });

  it('forwards fill/width/height/viewBox and injects custom path', async () => {
    const customPath = '<path d="M0 0H10V10H0z" />';
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => (
        <svg-component fill="#ff0000" width={32} height={16} viewBox="0 0 24 24" path={customPath}></svg-component>
      ),
    });

    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const svg = host.querySelector('svg') as SVGSVGElement;

    expect(svg.getAttribute('fill')).toBe('#ff0000');
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('height')).toBe('16');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');

    const path = svg.querySelector('path') as SVGPathElement;
    expect(path).not.toBeNull();
    expect(path.getAttribute('d')).toBe('M0 0H10V10H0z');

    expect(page.root).toMatchInlineSnapshot(`
<svg-component>
  <svg fill="#ff0000" height="16" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H10V10H0z"></path>
  </svg>
</svg-component>
`);
  });

  it('applies svg-margin as inline styles (left/right/both) and can clear them', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component svg-margin="left"></svg-component>,
    });

    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const cmp = host as any;
    const svg = host.querySelector('svg') as SVGSVGElement;

    // left
    expect(svg.style.marginLeft).toBe('10px');
    expect(svg.style.marginRight).toBe('');

    // right
    cmp.svgMargin = 'right';
    await page.waitForChanges();
    expect(svg.style.marginLeft).toBe('');
    expect(svg.style.marginRight).toBe('10px');

    // both
    cmp.svgMargin = 'both';
    await page.waitForChanges();
    expect(svg.style.marginLeft).toBe('10px');
    expect(svg.style.marginRight).toBe('10px');

    // clear
    cmp.svgMargin = '';
    await page.waitForChanges();
    expect(svg.style.marginLeft).toBe('');
    expect(svg.style.marginRight).toBe('');

    expect(page.root).toMatchInlineSnapshot(`
<svg-component svg-margin="left">
  <svg fill="currentColor" height="24" viewBox="0 0 640 640" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"></path>
  </svg>
</svg-component>
`);
  });

  it('forwards ARIA props (svg-aria-hidden / svg-aria-label) and updates on change', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component svg-aria-hidden="true" svg-aria-label="Close"></svg-component>,
    });

    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const cmp = host as any;
    const svg = host.querySelector('svg') as SVGSVGElement;

    // initial
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('aria-label')).toBe('Close');
    expect(svg.getAttribute('role')).toBe('img');

    // update to false + remove label
    cmp.svgAriaHidden = 'false';
    cmp.svgAriaLabel = '';
    await page.waitForChanges();

    expect(svg.getAttribute('aria-hidden')).toBe('false');
    expect(svg.getAttribute('aria-label')).toBeNull();
    expect(svg.getAttribute('role')).toBeNull();

    expect(page.root).toMatchInlineSnapshot(`
<svg-component svg-aria-hidden="true" svg-aria-label="Close">
  <svg aria-hidden="false" fill="currentColor" height="24" viewBox="0 0 640 640" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"></path>
  </svg>
</svg-component>
`);
  });

  it('updates the inner svg markup when path changes', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component path={'<path d="M1 1H2V2H1z" />'}></svg-component>,
    });

    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const cmp = host as any;
    const svg = host.querySelector('svg') as SVGSVGElement;

    const p1 = svg.querySelector('path') as SVGPathElement;
    expect(p1.getAttribute('d')).toBe('M1 1H2V2H1z');

    cmp.path = '<path d="M9 9H10V10H9z" />';
    await page.waitForChanges();

    const p2 = svg.querySelector('path') as SVGPathElement;
    expect(p2.getAttribute('d')).toBe('M9 9H10V10H9z');

    expect(page.root).toMatchInlineSnapshot(`
<svg-component>
  <svg fill="currentColor" height="24" viewBox="0 0 640 640" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 9H10V10H9z"></path>
  </svg>
</svg-component>
`);
  });

  it('does not override a custom path with the default path during componentDidLoad', async () => {
    const customPath = '<path d="M10 10H20V20H10z" />';
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component path={customPath}></svg-component>,
    });

    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const svg = host.querySelector('svg') as SVGSVGElement;

    const path = svg.querySelector('path') as SVGPathElement;
    expect(path).not.toBeNull();
    expect(path.getAttribute('d')).toBe('M10 10H20V20H10z');

    // sanity: should NOT match the component's built-in default path prefix
    const d = path.getAttribute('d') || '';
    expect(d.startsWith('M341.8 72.6')).toBe(false);

    expect(page.root).toMatchInlineSnapshot(`
<svg-component>
  <svg fill="currentColor" height="24" viewBox="0 0 640 640" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10H20V20H10z"></path>
  </svg>
</svg-component>
`);
  });

  it('falls back to fill=currentColor when fill="" is provided', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component fill=""></svg-component>,
    });

    await page.waitForChanges();

    const host = page.root as HTMLElement;
    const svg = host.querySelector('svg') as SVGSVGElement;

    expect(svg.getAttribute('fill')).toBe('currentColor');

    expect(page.root).toMatchInlineSnapshot(`
<svg-component>
  <svg fill="currentColor" height="24" viewBox="0 0 640 640" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"></path>
  </svg>
</svg-component>
`);
  });
});
