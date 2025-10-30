// src/components/pagination/standard-pagination-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { StandardPagination } from './standard-pagination-component';

describe('standard-pagination-component', () => {
  it('default snapshot with first/prev/next/last', async () => {
    const page = await newSpecPage({
      components: [StandardPagination],
      template: () => <standard-pagination-component currentPage={3} totalPages={9} limit={5} paginationLayout="center" goToButtons="text" />,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('does not render <undefined> wrapper (Fragments handled)', async () => {
    const page = await newSpecPage({
      components: [StandardPagination],
      template: () => <standard-pagination-component currentPage={1} totalPages={3} />,
    });
    expect(page.root!.querySelector('undefined')).toBeNull();
  });

  it('hideGotoEndButtons removes nav edges', async () => {
    const page = await newSpecPage({
      components: [StandardPagination],
      template: () => <standard-pagination-component currentPage={2} totalPages={5} hideGotoEndButtons />,
    });
    expect(page.root).toMatchSnapshot();
    const texts = Array.from(page.root!.querySelectorAll('button.page-link')).map(b => b.textContent?.trim());
    expect(texts).not.toContain('First');
    expect(texts).not.toContain('Prev');
    expect(texts).not.toContain('Next');
    expect(texts).not.toContain('Last');
  });
});
