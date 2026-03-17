// src/components/pagination/pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PaginationComponent } from './pagination-component';
import { StandardPagination } from './standard-pagination-component';
import { MinimizePagination } from './minimize-pagination-component';
import { ByPagePagination } from './by-page-pagination-component';

// ----------------------------- snapshot helpers -----------------------------

/**
 * Normalize per-instance ids (uid / generated select ids) so snapshots are stable
 * without relying on global CSS.escape (not available in Jest/mock-doc).
 */
function normalizeHtml(node: Element | ShadowRoot | DocumentFragment | string) {
  const html = typeof node === 'string' ? node : (node as any).outerHTML || (node as any).innerHTML || '';

  return (
    html
      // pagination-component uid: pgc-<hex>-<hex>
      .replace(/pgc-[a-f0-9]+-[a-f0-9]+/g, 'pgc-<uid>')
      // pageSize select id: pageSize-pgc-<uid>
      .replace(/pageSize-pgc-[^"'\s>]+/g, 'pageSize-<id>')
      // help id
      .replace(/pageSize-[^"'\s>]+__help/g, 'pageSize-<id>__help')
      // range id: pageRange-<uid>-<pos>
      .replace(/pageRange-(?:[^"'\s>]+)-(top|bottom|both)/g, 'pageRange-<id>-$1')
  );
}

/** Escape for attribute selector value: [id="..."] (minimal quotes/backslashes). */
function escapeAttrValue(v: string): string {
  return String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
function queryById(root: ParentNode, id: string) {
  return root.querySelector(`[id="${escapeAttrValue(id)}"]`);
}
function parseIdRefs(value: string | null | undefined): string[] {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

describe('pagination-component', () => {
  let randSpy: jest.SpyInstance<number, []>;
  let nowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    // stabilize uid generation
    randSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
  });

  afterEach(() => {
    randSpy?.mockRestore();
    nowSpy?.mockRestore();
  });

  it('renders STANDARD by default (wrapped in a nav landmark)', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => (
        <pagination-component currentPage={1} totalRows={100} pageSize={10} paginationLayout="center" goToButtons="text" />
      ),
    });

    expect(page.root!.querySelector('standard-pagination-component')).not.toBeNull();

    // Parent now wraps the child in a <nav aria-label="...">
    const nav = page.root!.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute('aria-label')).toBe('Pagination');

    expect(normalizeHtml(page.root as any)).toMatchSnapshot('renders-standard-default');
  });

  it('renders MINIMIZE when variant="minimize" (preferred API)', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => (
        <pagination-component variant="minimize" currentPage={2} totalRows={50} pageSize={10} paginationLayout="end" size="sm" />
      ),
    });

    expect(page.root!.querySelector('minimize-pagination-component')).not.toBeNull();
    expect(normalizeHtml(page.root as any)).toMatchSnapshot('renders-minimize-variant');
  });

  it('renders BY-PAGE when variant="by-page" (preferred API)', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => (
        <pagination-component
          variant="by-page"
          currentPage={5}
          totalRows={420}
          pageSize={10}
          paginationLayout="center"
          size="lg"
          plumage
          goToButtons="text"
        />
      ),
    });

    expect(page.root!.querySelector('by-page-pagination-component')).not.toBeNull();
    expect(normalizeHtml(page.root as any)).toMatchSnapshot('renders-by-page-variant');
  });

  it('size changer + display range: label is present (even if "for" not exposed in mock DOM) and aria-describedby resolves', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => (
        <pagination-component
          currentPage={1}
          totalRows={1234}
          pageSize={10}
          itemsPerPage
          displayTotalNumberOfPages
          itemsPerPageOptions={[10, 20, 50, 100, 'All']}
          paginationLayout="start"
          plumage
        />
      ),
    });

    const root = page.root!;
    expect(root.textContent || '').toMatch(/1-10 of 1234/);

    const select = root.querySelector('select') as HTMLSelectElement | null;
    expect(select).toBeTruthy();

    // In Stencil mock DOM, <label htmlFor="..."> may not reliably show up as [for="..."].
    // So we assert the label exists and (if the attribute is present) it matches the select id.
    const label = root.querySelector('.size-changer label') as HTMLLabelElement | null;
    expect(label).toBeTruthy();

    const forAttr = label?.getAttribute('for');
    if (forAttr) {
      expect(select?.id).toBeTruthy();
      expect(forAttr).toBe(select!.id);
    }

    // aria-describedby must exist and point to a real help node
    const describedBy = select?.getAttribute('aria-describedby');
    const ids = parseIdRefs(describedBy);
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach(id => {
      expect(queryById(root, id)).toBeTruthy();
    });

    expect(normalizeHtml(root as any)).toMatchSnapshot('renders-size-changer-and-range');
  });

  it('emits page-changed when child emits change-page', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => <pagination-component currentPage={1} totalRows={30} pageSize={10} />,
    });

    const spy = jest.fn();
    page.root!.addEventListener('page-changed', (e: any) => spy(e.detail));

    const child = page.root!.querySelector('standard-pagination-component')!;
    child.dispatchEvent(new CustomEvent('change-page', { bubbles: true, composed: true, detail: { page: 2 } }));

    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
    expect(page.root!.getAttribute('current-page')).toBe('2');
  });

  it('warns when both legacy variant flags set (minimize wins by precedence)', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => <pagination-component useMinimizePagination />, // start with one flag
    });

    // toggle second flag to trigger @Watch (validateVariant)
    page.root!.setAttribute('use-by-page-pagination', '');
    await page.waitForChanges();

    // validateVariant warning
    expect(warn).toHaveBeenCalledWith('[pagination] Both legacy variants set; minimize wins.');

    // effectiveVariant getter warning (during render)
    expect(warn).toHaveBeenCalledWith('[pagination] Both legacy variants set; using minimize by precedence.');

    expect(warn).toHaveBeenCalledTimes(2);

    warn.mockRestore();
  });
});
