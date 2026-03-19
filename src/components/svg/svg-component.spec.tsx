// src/components/svg/svg-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { SvgComponent } from './svg-component';

function normalizeIds(html: string) {
  return html
    // normalize title/desc ids
    .replace(/svg_[a-z0-9]+-title/g, 'svg_TEST-title')
    .replace(/svg_[a-z0-9]+-desc/g, 'svg_TEST-desc')
    // normalize any aria-labelledby/aria-describedby references to those ids too
    .replace(/aria-labelledby="svg_[a-z0-9]+-title"/g, 'aria-labelledby="svg_TEST-title"')
    .replace(/aria-describedby="svg_[a-z0-9]+-desc"/g, 'aria-describedby="svg_TEST-desc"');
}

describe('svg-component', () => {
  beforeAll(() => {
    // Stable-ish ids (still normalize anyway)
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterAll(() => {
    (Math.random as unknown as jest.Mock).mockRestore?.();
  });

  it('renders with defaults (decorative-by-default): aria-hidden=true, tabindex=-1, focusable=false, path default injected', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component></svg-component>,
    });

    await page.waitForChanges();

    const svg = (page.root as HTMLElement).querySelector('svg') as SVGSVGElement;

    expect(svg).not.toBeNull();
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
    expect(svg.getAttribute('viewBox')).toBe('0 0 640 640');

    // decorative default
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('role')).toBeNull();
    expect(svg.getAttribute('aria-label')).toBeNull();
    expect(svg.getAttribute('aria-labelledby')).toBeNull();
    expect(svg.getAttribute('aria-describedby')).toBeNull();

    // focus defaults
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.getAttribute('tabindex')).toBe('-1');

    // default path exists
    expect(svg.querySelector('path')).not.toBeNull();

    expect(normalizeIds(page.root!.outerHTML)).toMatchSnapshot();
  });

  it('forwards fill/width/height/viewBox and injects custom path (still decorative unless named)', async () => {
    const customPath = '<path d="M0 0H10V10H0z" />';
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component fill="#ff0000" width={32} height={16} viewBox="0 0 24 24" path={customPath}></svg-component>,
    });

    await page.waitForChanges();

    const svg = (page.root as HTMLElement).querySelector('svg') as SVGSVGElement;

    expect(svg.getAttribute('fill')).toBe('#ff0000');
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('height')).toBe('16');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');

    // decorative by default
    expect(svg.getAttribute('aria-hidden')).toBe('true');

    const path = svg.querySelector('path') as SVGPathElement;
    expect(path).not.toBeNull();
    expect(path.getAttribute('d')).toBe('M0 0H10V10H0z');

    expect(normalizeIds(page.root!.outerHTML)).toMatchSnapshot();
  });

  it('a11y: aria-labelledby takes precedence over aria-label; describedby forwarded; meaningful icon sets role=img and no aria-hidden', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => (
        <div>
          <div id="ext-label">External label</div>
          <div id="ext-help">External help</div>

          <svg-component
            svg-aria-label="Ignored"
            svg-aria-labelledby="ext-label"
            svg-aria-describedby="ext-help"
            svg-aria-hidden="false"
            path={'<path d="M0 0H1V1H0z" />'}
          ></svg-component>
        </div>
      ),
    });

    await page.waitForChanges();

    const host = page.body.querySelector('svg-component') as HTMLElement;
    const svg = host.querySelector('svg') as SVGSVGElement;

    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);

    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-hidden')).toBeNull();

    expect(svg.getAttribute('aria-labelledby')).toBe('ext-label');
    expect(svg.getAttribute('aria-label')).toBeNull();

    expect(svg.getAttribute('aria-describedby')).toBe('ext-help');

    expect(normalizeIds(page.body.outerHTML)).toMatchSnapshot();
  });

  it('a11y: svg-aria-label produces role=img; switching to decorative (aria-hidden=true) clears name wiring', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component svg-aria-hidden="false" svg-aria-label="Close"></svg-component>,
    });

    await page.waitForChanges();

    const cmp = page.rootInstance as any;
    const svg = (page.root as HTMLElement).querySelector('svg') as SVGSVGElement;

    // meaningful
    expect(svg.getAttribute('aria-hidden')).toBeNull();
    expect(svg.getAttribute('aria-label')).toBe('Close');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('tabindex')).toBeNull(); // meaningful icons not tabbable by default

    // switch to decorative
    cmp.svgAriaHidden = 'true';
    cmp.svgAriaLabel = '';
    await page.waitForChanges();

    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('aria-label')).toBeNull();
    expect(svg.getAttribute('aria-labelledby')).toBeNull();
    expect(svg.getAttribute('aria-describedby')).toBeNull();
    expect(svg.getAttribute('role')).toBeNull();
    expect(svg.getAttribute('tabindex')).toBe('-1');

    expect(normalizeIds(page.root!.outerHTML)).toMatchSnapshot();
  });

  it('supports svg-title/svg-desc: injects <title>/<desc>, uses title as name when no aria-label/labelledby, uses desc as describedby when none provided', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => (
        <svg-component
          svg-aria-hidden="false"
          svg-title="Settings"
          svg-desc="Opens settings"
          path={'<path d="M0 0H10V10H0z" />'}
        ></svg-component>
      ),
    });

    await page.waitForChanges();

    const svg = (page.root as HTMLElement).querySelector('svg') as SVGSVGElement;

    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-hidden')).toBeNull();

    const title = svg.querySelector('title') as SVGTitleElement | null;
    const desc = svg.querySelector('desc') as SVGDescElement | null;

    expect(title?.textContent?.trim()).toBe('Settings');
    expect(desc?.textContent?.trim()).toBe('Opens settings');

    // name/description should reference generated ids
    expect(svg.getAttribute('aria-labelledby')).toBeTruthy();
    expect(svg.getAttribute('aria-describedby')).toBeTruthy();

    expect(normalizeIds(page.root!.outerHTML)).toMatchSnapshot();
  });

  it('updates the inner svg markup when path changes', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component path={'<path d="M1 1H2V2H1z" />'}></svg-component>,
    });

    await page.waitForChanges();

    const cmp = page.rootInstance as any;
    const svg = (page.root as HTMLElement).querySelector('svg') as SVGSVGElement;

    const p1 = svg.querySelector('path') as SVGPathElement;
    expect(p1.getAttribute('d')).toBe('M1 1H2V2H1z');

    cmp.path = '<path d="M9 9H10V10H9z" />';
    await page.waitForChanges();

    const p2 = svg.querySelector('path') as SVGPathElement;
    expect(p2.getAttribute('d')).toBe('M9 9H10V10H9z');

    expect(normalizeIds(page.root!.outerHTML)).toMatchSnapshot();
  });

  it('does not override a custom path with the default path during componentDidLoad', async () => {
    const customPath = '<path d="M10 10H20V20H10z" />';
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component path={customPath}></svg-component>,
    });

    await page.waitForChanges();

    const svg = (page.root as HTMLElement).querySelector('svg') as SVGSVGElement;
    const path = svg.querySelector('path') as SVGPathElement;

    expect(path).not.toBeNull();
    expect(path.getAttribute('d')).toBe('M10 10H20V20H10z');
    expect((path.getAttribute('d') || '').startsWith('M341.8 72.6')).toBe(false);

    expect(normalizeIds(page.root!.outerHTML)).toMatchSnapshot();
  });

  it('falls back to fill=currentColor when fill="" is provided', async () => {
    const page = await newSpecPage({
      components: [SvgComponent],
      template: () => <svg-component fill=""></svg-component>,
    });

    await page.waitForChanges();

    const svg = (page.root as HTMLElement).querySelector('svg') as SVGSVGElement;
    expect(svg.getAttribute('fill')).toBe('currentColor');

    expect(normalizeIds(page.root!.outerHTML)).toMatchSnapshot();
  });
});
