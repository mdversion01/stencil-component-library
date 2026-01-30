// src/components/pagination/by-page-pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ByPagePagination } from './by-page-pagination-component';

describe('by-page-pagination-component', () => {
  it('snapshot plumage + center', async () => {
    const page = await newSpecPage({
      components: [ByPagePagination],
      template: () => (
        <by-page-pagination-component
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

  it('input change emits change-page with valid number', async () => {
    const page = await newSpecPage({
      components: [ByPagePagination],
      template: () => (
        <by-page-pagination-component
          currentPage={2}
          totalRows={100}
          pageSize={10}
        />
      ),
    });

    const spy = jest.fn();
    page.root!.addEventListener('change-page', (e: any) => spy(e.detail));

    const input = page.root!.querySelector('input.page-input') as HTMLInputElement;
    expect(input).not.toBeNull();

    input.value = '7';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith({ page: 7 });
  });

  it('invalid input does not emit', async () => {
    const page = await newSpecPage({
      components: [ByPagePagination],
      template: () => (
        <by-page-pagination-component
          currentPage={2}
          totalRows={50}
          pageSize={10}
        />
      ),
    });

    const spy = jest.fn();
    page.root!.addEventListener('change-page', (e: any) => spy(e.detail));

    const input = page.root!.querySelector('input.page-input') as HTMLInputElement;
    expect(input).not.toBeNull();

    input.value = '999';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    expect(spy).not.toHaveBeenCalled();
  });
});
