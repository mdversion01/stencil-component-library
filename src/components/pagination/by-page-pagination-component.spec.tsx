// src/components/pagination/by-page-pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ByPagePagination } from './by-page-pagination-component';

describe('by-page-pagination-component', () => {
  it('snapshot plumage + center (use stable control-id so IDs are predictable)', async () => {
    const page = await newSpecPage({
      components: [ByPagePagination],
      template: () => (
        <by-page-pagination-component
          controlId="byPageA11y"
          currentPage={10}
          totalRows={300}
          pageSize={10}
          plumage
          size="lg"
          paginationLayout="center"
        />
      ),
    });

    expect(page.root).toMatchSnapshot();
  });

  it('renders required a11y wiring for page input (ids + aria-describedby resolve)', async () => {
    const page = await newSpecPage({
      components: [ByPagePagination],
      template: () => (
        <by-page-pagination-component
          controlId="byPageA11y"
          currentPage={2}
          totalRows={100}
          pageSize={10}
          paginationLayout="center"
          // ✅ required so the range element exists (bppc-range-*)
          displayTotalNumberOfPages
        />
      ),
    });

    const root = page.root!;
    expect(root).toBeTruthy();

    // nav landmark + label
    const nav = root.querySelector('nav') as HTMLElement | null;
    expect(nav).toBeTruthy();
    expect(nav!.getAttribute('aria-label')).toBe('Pagination');

    // Stable ids derive from control-id first
    const rangeId = 'bppc-range-byPageA11y';
    const pageInputId = 'bppc-pageInput-byPageA11y';
    const pageInputLabelId = `${pageInputId}__label`;
    const pageInputHelpId = `${pageInputId}__help`;

    // range region exists + status semantics
    const range = root.querySelector(`#${rangeId}`) as HTMLElement | null;
    expect(range).toBeTruthy();
    expect(range!.getAttribute('role')).toBe('status');
    expect(range!.getAttribute('aria-live')).toBe('polite');
    expect(range!.getAttribute('aria-atomic')).toBe('true');

    // input exists + id/label/description wiring
    const input = root.querySelector(`input#${pageInputId}.page-input`) as HTMLInputElement | null;
    expect(input).toBeTruthy();
    expect(input!.getAttribute('type')).toBe('number');

    expect(input!.getAttribute('aria-labelledby')).toBe(pageInputLabelId);

    const describedBy = (input!.getAttribute('aria-describedby') || '').trim();
    const describedIds = describedBy.split(/\s+/).filter(Boolean);

    // should include help + range ids
    expect(describedIds).toEqual(expect.arrayContaining([pageInputHelpId, rangeId]));

    // referenced nodes exist
    expect(root.querySelector(`#${pageInputLabelId}`)).toBeTruthy();
    expect(root.querySelector(`#${pageInputHelpId}`)).toBeTruthy();
    expect(root.querySelector(`#${rangeId}`)).toBeTruthy();
  });

  it('input change emits change-page with valid number', async () => {
    const page = await newSpecPage({
      components: [ByPagePagination],
      template: () => (
        <by-page-pagination-component controlId="byPageEmit" currentPage={2} totalRows={100} pageSize={10} />
      ),
    });

    const spy = jest.fn();
    page.root!.addEventListener('change-page', (e: any) => spy(e.detail));

    const input = page.root!.querySelector('input.page-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    input.value = '7';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith({ page: 7 });
  });

  it('invalid input does not emit', async () => {
    const page = await newSpecPage({
      components: [ByPagePagination],
      template: () => (
        <by-page-pagination-component controlId="byPageNoEmit" currentPage={2} totalRows={50} pageSize={10} />
      ),
    });

    const spy = jest.fn();
    page.root!.addEventListener('change-page', (e: any) => spy(e.detail));

    const input = page.root!.querySelector('input.page-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    input.value = '999';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  it('Enter key commits page number (keydown handler)', async () => {
    const page = await newSpecPage({
      components: [ByPagePagination],
      template: () => (
        <by-page-pagination-component controlId="byPageEnter" currentPage={1} totalRows={120} pageSize={10} />
      ),
    });

    const spy = jest.fn();
    page.root!.addEventListener('change-page', (e: any) => spy(e.detail));

    const input = page.root!.querySelector('input.page-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    input.value = '12';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith({ page: 12 });
  });
});
