// src/components/pagination/pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PaginationComponent } from './pagination-component';
import { StandardPagination } from './standard-pagination-component';
import { MinimizePagination } from './minimize-pagination-component';
import { ByPagePagination } from './by-page-pagination-component';

describe('pagination-component', () => {
  it('renders STANDARD by default', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => <pagination-component currentPage={1} totalPages={10} paginationLayout="center" goToButtons="text" />,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.root!.querySelector('standard-pagination-component')).not.toBeNull();
  });

  it('renders MINIMIZE when useMinimizePagination', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => <pagination-component useMinimizePagination currentPage={2} totalPages={5} paginationLayout="end" size="sm" />,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.root!.querySelector('minimize-pagination-component')).not.toBeNull();
  });

  it('renders BY-PAGE when useByPagePagination', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => <pagination-component useByPagePagination currentPage={5} totalPages={42} paginationLayout="center" size="lg" plumage goToButtons="text" />,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.root!.querySelector('by-page-pagination-component')).not.toBeNull();
  });

  it('size changer + display range snapshot', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => (
        <pagination-component currentPage={1} totalRows={1234} showSizeChanger showDisplayRange pageSizeOptions={[10, 20, 50, 100, 'All']} paginationLayout="start" plumage />
      ),
    });
    expect(page.root).toMatchSnapshot();
    expect(page.root!.textContent).toMatch(/1-10 of 1234/);
  });

  it('emits page-changed when child emits change-page', async () => {
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => <pagination-component currentPage={1} totalPages={3} />,
    });
    const spy = jest.fn();
    page.root!.addEventListener('page-changed', (e: any) => spy(e.detail));

    const child = page.root!.querySelector('standard-pagination-component')!;
    child.dispatchEvent(new CustomEvent('change-page', { bubbles: true, detail: { page: 2 } }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
    expect(page.root!.getAttribute('current-page')).toBe('2');
  });

  it('warns when both variant flags set', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const page = await newSpecPage({
      components: [PaginationComponent, StandardPagination, MinimizePagination, ByPagePagination],
      template: () => <pagination-component useMinimizePagination />, // start with one flag
    });
    // now toggle second flag to trigger @Watch
    page.root!.setAttribute('use-by-page-pagination', '');
    await page.waitForChanges();

    expect(warn).toHaveBeenCalledWith('[pagination] Both variants set; using minimize by precedence.');
    warn.mockRestore();
  });
});
