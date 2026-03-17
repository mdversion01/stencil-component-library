// src/components/pagination/standard-pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { StandardPagination } from './standard-pagination-component';

describe('standard-pagination-component', () => {
  it('default snapshot with first/prev/next/last (text goToButtons)', async () => {
    const page = await newSpecPage({
      components: [StandardPagination],
      template: () => (
        <standard-pagination-component
          currentPage={3}
          totalRows={90}   // 9 pages @ pageSize=10
          pageSize={10}
          limit={5}
          paginationLayout="center"
          goToButtons="text"
        />
      ),
    });

    expect(page.root).toMatchSnapshot();
  });

  it('does not render <undefined> wrapper (Fragments handled)', async () => {
    const page = await newSpecPage({
      components: [StandardPagination],
      template: () => (
        <standard-pagination-component
          currentPage={1}
          totalRows={30}  // 3 pages
          pageSize={10}
        />
      ),
    });

    expect(page.root!.querySelector('undefined')).toBeNull();
  });

  it('hideGoToButtons removes first/prev/next/last controls', async () => {
    const page = await newSpecPage({
      components: [StandardPagination],
      template: () => (
        <standard-pagination-component
          currentPage={2}
          totalRows={50}  // 5 pages
          pageSize={10}
          hideGoToButtons
          goToButtons="text"
        />
      ),
    });

    expect(page.root).toMatchSnapshot();

    const buttons = Array.from(page.root!.querySelectorAll('button.page-link')) as HTMLButtonElement[];

    // Ensure none of the go-to edge controls exist
    const ariaLabels = buttons.map(b => b.getAttribute('aria-label') || '');
    expect(ariaLabels.some(l => l.includes('Go to first page'))).toBe(false);
    expect(ariaLabels.some(l => l.includes('Go to previous page'))).toBe(false);
    expect(ariaLabels.some(l => l.includes('Go to next page'))).toBe(false);
    expect(ariaLabels.some(l => l.includes('Go to last page'))).toBe(false);

    // Numeric page buttons should still exist
    const numericText = buttons.map(b => (b.textContent || '').trim()).filter(Boolean);
    expect(numericText.some(t => /^\d+$/.test(t))).toBe(true);
  });
});
