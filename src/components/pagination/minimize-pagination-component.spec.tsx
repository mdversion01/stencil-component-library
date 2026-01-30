// src/components/pagination/minimize-pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { MinimizePagination } from './minimize-pagination-component';

describe('minimize-pagination-component', () => {
  it('snapshot', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => <minimize-pagination-component currentPage={3} totalRows={120} pageSize={10} paginationLayout="end" size="sm" goToButtons="text" />,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('emits change-page on next click', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => (
        <minimize-pagination-component
          currentPage={1}
          totalRows={20}
          pageSize={10}
        />
      ),
    });

    const spy = jest.fn();
    page.root!.addEventListener('change-page', (e: any) => spy(e.detail));

    const nextBtn = page.root!.querySelector('button.page-link[aria-label="Go to next page"]') as any;

    expect(nextBtn).not.toBeNull();

    // ✅ Mock DOM safe: verify not disabled via attribute
    expect(nextBtn.hasAttribute('disabled')).toBe(false);

    nextBtn.click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith({ page: 2 });
  });
});
