// src/components/badge/badge-component.spec.ts
import { newSpecPage } from '@stencil/core/testing';
import { Badge } from './badge-component';

describe('badge-component', () => {
  it('renders default badge', async () => {
    const page = await newSpecPage({
      components: [Badge],
      // NOTE: aria-label is not provided, so default (non token/dot) should be aria-hidden on host.
      html: `<badge-component></badge-component>`,
    });

    const rootDiv = page.root.querySelector('.badge') as HTMLDivElement;
    expect(rootDiv).toBeTruthy();
    expect(rootDiv.className).toContain('bg-secondary');

    // ARIA now lives on HOST
    expect(page.root.getAttribute('aria-hidden')).toBe('true');
    expect(page.root.getAttribute('role')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('renders token badge with ARIA props and inlineStyles', async () => {
    const page = await newSpecPage({
      components: [Badge],
      html: `<badge-component
        token
        variant="info"
        size="lg"
        aria-label="Token badge"
        aria-labelledby="badgeLabel"
        aria-describedby="badgeDesc"
        inline-styles="background-color: yellow; border-radius: 8px;"
      ></badge-component>`,
    });

    const token = page.root.querySelector('.badge__token') as HTMLSpanElement;
    expect(token).toBeTruthy();
    expect(token.className).toContain('bg-info');
    expect(token.className).toContain('lg');

    // ARIA now present on HOST (role/status + live region)
    expect(page.root.getAttribute('role')).toBe('status');
    expect(page.root.getAttribute('aria-live')).toBe('polite');
    expect(page.root.getAttribute('aria-atomic')).toBe('true');
    expect(page.root.getAttribute('aria-hidden')).toBeNull();

    expect(page.root.getAttribute('aria-label')).toBe('Token badge');
    expect(page.root.getAttribute('aria-labelledby')).toBe('badgeLabel');
    expect(page.root.getAttribute('aria-describedby')).toBe('badgeDesc');

    const style = token.getAttribute('style') || '';
    expect(style).toContain('background-color: yellow');
    expect(style).toContain('border-radius: 8px');

    expect(page.root).toMatchSnapshot();
  });

  it('renders dot badge with shape and pulse', async () => {
    const page = await newSpecPage({
      components: [Badge],
      html: `<badge-component dot pulse shape="circle" variant="danger"></badge-component>`,
    });

    const dot = page.root.querySelector('.badge--dot') as HTMLSpanElement;
    expect(dot).toBeTruthy();
    expect(dot.className).toContain('bg-danger');
    expect(dot.className).toMatch(/pulse/);
    expect(dot.className).toMatch(/circle|rounded/);

    // dot -> status role, not hidden
    expect(page.root.getAttribute('role')).toBe('status');
    expect(page.root.getAttribute('aria-hidden')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('renders positioned badge (left)', async () => {
    const page = await newSpecPage({
      components: [Badge],
      // no aria-label -> should be hidden on host
      html: `<badge-component bdg-position="left"></badge-component>`,
    });

    const node = page.root.querySelector('div')!;
    expect(node.className).toMatch(/me-1/);

    // ARIA now on HOST
    expect(page.root.getAttribute('aria-hidden')).toBe('true');

    expect(page.root).toMatchSnapshot();
  });

  it('renders positioned badge (right)', async () => {
    const page = await newSpecPage({
      components: [Badge],
      // no aria-label -> should be hidden on host
      html: `<badge-component bdg-position="right"></badge-component>`,
    });

    const node = page.root.querySelector('div')!;
    expect(node.className).toMatch(/ms-1/);

    expect(page.root.getAttribute('aria-hidden')).toBe('true');

    expect(page.root).toMatchSnapshot();
  });

  it('applies dynamic styles correctly (token path)', async () => {
    const page = await newSpecPage({
      components: [Badge],
      html: `<badge-component
        token
        absolute
        left="10"
        top="20"
        z-index="5"
      ></badge-component>`,
    });

    const span = page.root.querySelector('.badge__token') as HTMLSpanElement;
    const style = span.getAttribute('style') || '';

    expect(style).toContain('position: absolute');
    expect(style).toContain('left: 10px');
    expect(style).toContain('top: 20px');
    expect(style).toContain('z-index: 5');

    // token -> status role
    expect(page.root.getAttribute('role')).toBe('status');

    expect(page.root).toMatchSnapshot();
  });

  // ── NEW: lock outlined + bordered + elevation (token) ─────────
  it('token badge: outlined + bordered + elevation classes present and stable', async () => {
    const page = await newSpecPage({
      components: [Badge],
      html: `<badge-component token outlined bordered elevation="3" variant="primary"></badge-component>`,
    });

    const token = page.root.querySelector('.badge__token') as HTMLSpanElement;
    expect(token).toBeTruthy();

    const cls = token.className;
    expect(cls).toContain('elevated-3');
    expect(cls).toMatch(/outlined|badge--outlined/);
    expect(cls).toMatch(/bordered|badge--bordered/);

    expect(page.root).toMatchSnapshot();
  });

  // ── NEW: lock bordered + elevation (dot) ──────────────────────
  it('dot badge: bordered + elevation classes present and stable', async () => {
    const page = await newSpecPage({
      components: [Badge],
      html: `<badge-component dot bordered elevation="2" variant="success"></badge-component>`,
    });

    const dot = page.root.querySelector('.badge--dot') as HTMLSpanElement;
    expect(dot).toBeTruthy();

    const cls = dot.className;
    expect(cls).toContain('elevated-2');
    expect(cls).toMatch(/bordered|badge--bordered/);

    // dot -> status role
    expect(page.root.getAttribute('role')).toBe('status');

    expect(page.root).toMatchSnapshot();
  });
});
