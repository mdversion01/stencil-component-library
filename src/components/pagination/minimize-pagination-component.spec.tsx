// src/components/pagination/minimize-pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { MinimizePagination } from './minimize-pagination-component';

describe('minimize-pagination-component', () => {
  it('snapshot', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => <minimize-pagination-component currentPage={3} totalPages={12} paginationLayout="end" size="sm" goToButtons="text" />,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('emits change-page on next click', async () => {
    const page = await newSpecPage({
      components: [MinimizePagination],
      template: () => <minimize-pagination-component currentPage={1} totalPages={2} />,
    });
    const spy = jest.fn();
    page.root!.addEventListener('change-page', (e: any) => spy(e.detail));

    const nextBtn = Array.from(page.root!.querySelectorAll('button.page-link')).find(
      b => (b.textContent || '').trim() === '›' || (b.textContent || '').trim() === 'Next',
    ) as HTMLButtonElement;

    nextBtn.click();
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith({ page: 2 });
  });
});
