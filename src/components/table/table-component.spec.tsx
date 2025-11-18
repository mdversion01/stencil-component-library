import { newSpecPage } from '@stencil/core/testing';
import { TableComponent } from './table-component';

describe('table-component', () => {
  it('renders a basic table (snapshot)', async () => {
    const page = await newSpecPage({
      components: [TableComponent],
      html: `<table-component table-id="t1"></table-component>`,
    });

    // set props after creation
    page.root.items = [{ first_name: 'Anna', age: 25 }];
    page.root.originalItems = [{ first_name: 'Anna', age: 25 }];
    page.root.fields = [
      { key: 'first_name', label: 'First Name', sortable: true },
      { key: 'age', label: 'Age', sortable: true },
    ];
    page.root.sortable = true;

    await page.waitForChanges();

    expect(page.root).toMatchInlineSnapshot(`
<table-component table-id="t1">
  <!---->
  <div>
    <table aria-colcount="2" aria-multiselectable="true" class="b-table table" id="t1" role="table">
      <thead role="rowgroup">
        <tr role="row">
          <th aria-colindex="1" aria-sort="none" data-field="first_name" role="columnheader" scope="col" tabindex="0" style="cursor: pointer;">
            First Name
            <i class="none sort-icon"></i>
          </th>
          <th aria-colindex="2" aria-sort="none" data-field="age" role="columnheader" scope="col" tabindex="0" style="cursor: pointer;">
            Age
            <i class="none sort-icon"></i>
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        <tr aria-selected="false" class="striped-row" role="row" tabindex="0">
          <td aria-colindex="1" role="cell">
            Anna
          </td>
          <td aria-colindex="2" role="cell">
            25
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</table-component>
`);
  });

  it('passes pagination size and renders at top and bottom when requested', async () => {
    const page = await newSpecPage({
      components: [TableComponent],
      html: `<table-component table-id="t2"></table-component>`,
    });

    // data + fields
    page.root.items = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 28 },
      { name: 'Mike', age: 35 },
    ];
    page.root.originalItems = [...page.root.items];
    page.root.fields = ['name', 'age'];

    // turn on pagination and show at both positions
    page.root.usePagination = true;
    page.root.paginationPosition = 'both';
    page.root.rowsPerPage = 2;
    page.root.paginationSize = 'sm'; // <- should flow to <pagination-component size="sm">
    await page.waitForChanges();

    const pagers = page.root.querySelectorAll('pagination-component');
    expect(pagers.length).toBe(2);

    // top pager
    expect(pagers[0].getAttribute('position')).toBe('top');
    expect(pagers[0].getAttribute('size')).toBe('sm');

    // bottom pager
    expect(pagers[1].getAttribute('position')).toBe('bottom');
    expect(pagers[1].getAttribute('size')).toBe('sm');
  });
});
