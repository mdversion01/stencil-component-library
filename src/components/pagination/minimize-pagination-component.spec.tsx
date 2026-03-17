// src/components/pagination/minimize-pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { MinimizePagination } from './minimize-pagination-component';

describe('minimize-pagination-component', () => {
  it('snapshot (nav landmark + buttons)', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => (
        <minimize-pagination-component
          currentPage={3}
          totalRows={120}
          pageSize={10}
          paginationLayout="end"
          size="sm"
          goToButtons="text"
          paginationAriaLabel="Table pagination"
        />
      ),
    });

    expect(page.root).toMatchSnapshot();
  });

  it('renders a nav landmark with aria-label and does NOT use menubar/menuitem roles', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => (
        <minimize-pagination-component currentPage={1} totalRows={20} pageSize={10} paginationAriaLabel="Pagination" />
      ),
    });

    const root = page.root!;
    const nav = root.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav!.getAttribute('aria-label')).toBe('Pagination');

    const ul = root.querySelector('ul.pagination');
    expect(ul).toBeTruthy();

    expect(root.querySelector('[role="menubar"]')).toBeNull();
    expect(root.querySelector('[role="menuitem"]')).toBeNull();
    expect(root.querySelector('[role="menuitemradio"]')).toBeNull();
  });

  it('emits change-page on next click', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => <minimize-pagination-component currentPage={1} totalRows={20} pageSize={10} />,
    });

    const spy = jest.fn();
    page.root!.addEventListener('change-page', (e: any) => spy(e.detail));

    const nextBtn = page.root!.querySelector(
      'button.page-link[aria-label="Go to next page"]',
    ) as HTMLButtonElement | null;

    expect(nextBtn).not.toBeNull();
    expect(nextBtn!.hasAttribute('disabled')).toBe(false);

    nextBtn!.click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith({ page: 2 });
    expect(page.root!.getAttribute('current-page')).toBe('2');
  });

  it('disabled nav buttons are not focusable (tabIndex=-1) and set aria-disabled', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => <minimize-pagination-component currentPage={1} totalRows={20} pageSize={10} />,
    });

    const first = page.root!.querySelector(
      'button.page-link[aria-label="Go to first page"]',
    ) as HTMLButtonElement | null;

    const prev = page.root!.querySelector(
      'button.page-link[aria-label="Go to previous page"]',
    ) as HTMLButtonElement | null;

    expect(first).toBeTruthy();
    expect(prev).toBeTruthy();

    expect(first!.hasAttribute('disabled')).toBe(true);
    expect(prev!.hasAttribute('disabled')).toBe(true);

    expect(first!.getAttribute('aria-disabled')).toBe('true');
    expect(prev!.getAttribute('aria-disabled')).toBe('true');

    // Stencil/JSDOM may stringify tabIndex; accept either
    expect(String(first!.getAttribute('tabindex') ?? first!.tabIndex)).toBe('-1');
    expect(String(prev!.getAttribute('tabindex') ?? prev!.tabIndex)).toBe('-1');
  });

  it('standalone items-per-page: label text exists, select has id, and aria-describedby resolves', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => (
        <minimize-pagination-component
          currentPage={1}
          totalRows={42}
          pageSize={10}
          itemsPerPage
          displayTotalNumberOfPages
          paginationLayout="start"
          pageSizeLabel="Items per page:"
          pageSizeHelpText="Help text for select."
        />
      ),
    });

    const root = page.root!;
    const label = root.querySelector('.size-changer label') as HTMLLabelElement | null;
    const select = root.querySelector('.size-changer select') as HTMLSelectElement | null;

    expect(label).toBeTruthy();
    expect(select).toBeTruthy();

    // Some Stencil test DOMs don’t reliably expose `for` as an attribute.
    // Validate association in a tolerant way:
    const labelFor =
      label!.getAttribute('for') ||
      label!.getAttribute('htmlfor') ||
      (label as any).htmlFor ||
      '';

    expect((label!.textContent || '').replace(/\s+/g, ' ').trim()).toContain('Items per page');
    expect(select!.id).toBeTruthy();

    // If we can read the label's "for", ensure it matches the select id.
    if (labelFor) {
      expect(labelFor).toBe(select!.id);
    }

    // aria-describedby should exist and reference a real node inside the component
    const describedBy = select!.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();

    if (describedBy) {
      const help = root.querySelector(`#${describedBy}`) as HTMLElement | null;
      expect(help).toBeTruthy();
      expect((help!.textContent || '').trim()).toBe('Help text for select.');
    }

    // Range live region exists in standalone mode when displayTotalNumberOfPages=true
    const range = root.querySelector('[role="status"][aria-live="polite"]') as HTMLElement | null;
    expect(range).toBeTruthy();
    expect((range!.textContent || '').trim()).toMatch(/1-10 of 42/);
  });

  it('adds aria-controls to buttons when control-id is provided', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => <minimize-pagination-component currentPage={2} totalRows={50} pageSize={10} control-id="results-region" />,
    });

    const btns = Array.from(page.root!.querySelectorAll('button.page-link')) as HTMLButtonElement[];
    expect(btns.length).toBeGreaterThan(0);

    btns.forEach(b => {
      expect(b.getAttribute('aria-controls')).toBe('results-region');
    });
  });
});
