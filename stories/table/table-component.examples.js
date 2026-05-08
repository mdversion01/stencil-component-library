// src/stories/table-component.examples.js
export const reactExample = `import React, { useEffect, useRef } from "react";

const items = [
  { last_name: "MacDonald", first_name: "Thor", age: 40 },
  { last_name: "Smith", first_name: "Anna", age: 25 },
  { last_name: "Peterson", first_name: "Zachary", age: 36 },
];

const fields = [
  { key: "last_name", label: "Last Name", sortable: true },
  { key: "first_name", label: "First Name", sortable: true },
  { key: "age", label: "Age", sortable: true },
];

export default function TableComponentExample() {
  const tableRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const setupTable = async () => {
      await customElements.whenDefined("table-component");

      if (cancelled) return;

      const table = tableRef.current;
      if (!table) return;

      if (typeof table.componentOnReady === "function") {
        await table.componentOnReady();
      }

      if (cancelled) return;

      table.items = [...items];
      table.originalItems = [...items];
      table.fields = [...fields];
    };

    setupTable();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2>Table Component Example</h2>
      <table-component
        ref={tableRef}
        responsive
        striped
        sortable
        pagination-enabled
        pagination-variant="standard"
        pagination-position="bottom"
        rows-per-page="10"
        size="sm"
      ></table-component>
    </section>
  );
}
`;

export const reactPlaygroundExample = `import React, { useEffect, useRef } from "react";

const items = [
  { age: 40, first_name: "Thor", last_name: "MacDonald", _showDetails: true, _additionalInfo: "<p>Hello \${this.first_name}, Age: \${this.age}</p>" },
  { age: 20, first_name: "Pete", last_name: "MacDonald", _showDetails: true, _additionalInfo: "<p>Hello \${this.first_name}, Age: \${this.age}</p>" },
  { age: 25, first_name: "Anna", last_name: "Smith", _showDetails: true, _additionalInfo: "<p>Hello \${this.first_name}, Age: \${this.age}</p>" },
  { age: 36, first_name: "Zachary", last_name: "Peterson" },
  { age: 21, first_name: "Ralph", last_name: "MacDonald" },
  { age: 34, first_name: "Norma", last_name: "MacDonald" },
  { age: 25, first_name: "Emily", last_name: "Larson" },
  { age: 49, first_name: "Clark", last_name: "Griswald" },
  { age: 37, first_name: "George", last_name: "Jefferson" },
  { age: 30, first_name: "Patrick", last_name: "Adams" },
  { age: 19, first_name: "Keith", last_name: "Ericksen" },
  { age: 28, first_name: "Kelly", last_name: "Parker" },
  { age: 87, first_name: "Robert", last_name: "Mitchell" },
  { age: 30, first_name: "Derrick", last_name: "Clark" },
  { age: 54, first_name: "Rosa", last_name: "Gonzalez" },
];

const fields = [
  { key: "last_name", label: "Last Name", sortable: true },
  { key: "first_name", label: "First Name", sortable: true },
  { key: "age", label: "Age", sortable: true },
];

export default function reactPlaygroundExample() {
  const tableRef = useRef(null);
  const sortFieldRef = useRef(null);
  const sortOrderRef = useRef(null);
  const filterInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      await Promise.all([
        customElements.whenDefined("table-component"),
        customElements.whenDefined("select-field-component"),
        customElements.whenDefined("input-group-component"),
        customElements.whenDefined("dropdown-component"),
      ]);

      if (!mounted) return;

      const table = tableRef.current;
      const sortField = sortFieldRef.current;
      const sortOrder = sortOrderRef.current;
      const filterInput = filterInputRef.current;
      const dropdown = dropdownRef.current;

      if (!table || !sortField || !sortOrder || !filterInput || !dropdown) return;

      if (typeof table.componentOnReady === "function") await table.componentOnReady();
      if (typeof sortField.componentOnReady === "function") await sortField.componentOnReady();
      if (typeof sortOrder.componentOnReady === "function") await sortOrder.componentOnReady();
      if (typeof filterInput.componentOnReady === "function") await filterInput.componentOnReady();
      if (typeof dropdown.componentOnReady === "function") await dropdown.componentOnReady();

      table.items = [...items];
      table.originalItems = [...items];
      table.fields = [...fields];

      sortField.defaultOptionTxt = "";
      sortField.options = fields.map((field) => ({
        value: field.key,
        name: field.label,
      }));

      sortOrder.options = [
        { value: "asc", name: "Ascending" },
        { value: "desc", name: "Descending" },
      ];
      sortOrder.value = "asc";
      sortOrder.disabled = true;

      const dropdownOptions = fields.map((field, index) => ({
        key: field.key,
        name: field.label,
        value: field.key,
        label: field.label,
        checked: false,
        index,
      }));

      if (typeof dropdown.setOptions === "function") {
        dropdown.setOptions(dropdownOptions);
      } else {
        dropdown.options = dropdownOptions;
      }

      const onSortFieldChange = (ev) => {
        const value = ev?.detail?.value ?? ev?.target?.value ?? "";
        const normalized = value && value !== "none" ? value : "none";
        sortOrder.disabled = normalized === "none";
        table.dispatchEvent(
          new CustomEvent("sort-field-changed", {
            detail: { value: normalized },
            bubbles: true,
          })
        );
      };

      const onSortOrderChange = (ev) => {
        const value = ev?.detail?.value ?? ev?.target?.value ?? "asc";
        table.dispatchEvent(
          new CustomEvent("sort-order-changed", {
            detail: { value },
            bubbles: true,
          })
        );
      };

      const onFilterChange = (ev) => {
        const value = ev?.detail?.value ?? ev?.target?.value ?? "";
        table.dispatchEvent(
          new CustomEvent("filter-changed", {
            detail: { value: String(value) },
            bubbles: true,
          })
        );
      };

      const onSelectionChanged = (ev) => {
        const checked = Array.isArray(ev?.detail?.items) ? ev.detail.items : [];
        const selected = checked
          .filter((item) => item.checked)
          .map((item) => ({ key: item.key || item.value || item.name, checked: true }));

        document.dispatchEvent(
          new CustomEvent("filter-fields-changed", {
            detail: {
              tableId: "table-playground",
              items: selected,
            },
          })
        );
      };

      const onSortFieldUpdated = (ev) => {
        const value = ev?.detail?.value ?? "none";
        sortField.value = value === "none" ? "" : value;
        sortOrder.disabled = value === "none";
      };

      const onSortOrderUpdated = (ev) => {
        const value = ev?.detail?.value ?? "asc";
        sortOrder.value = value;
        if (sortField.value) sortOrder.disabled = false;
      };

      sortField.addEventListener("valueChange", onSortFieldChange);
      sortField.addEventListener("change", onSortFieldChange);
      sortOrder.addEventListener("valueChange", onSortOrderChange);
      sortOrder.addEventListener("change", onSortOrderChange);
      filterInput.addEventListener("input", onFilterChange);
      filterInput.addEventListener("change", onFilterChange);
      filterInput.addEventListener("valueChange", onFilterChange);
      dropdown.addEventListener("selection-changed", onSelectionChanged);
      table.addEventListener("sort-field-updated", onSortFieldUpdated);
      table.addEventListener("sort-order-updated", onSortOrderUpdated);

      table.__cleanup = () => {
        sortField.removeEventListener("valueChange", onSortFieldChange);
        sortField.removeEventListener("change", onSortFieldChange);
        sortOrder.removeEventListener("valueChange", onSortOrderChange);
        sortOrder.removeEventListener("change", onSortOrderChange);
        filterInput.removeEventListener("input", onFilterChange);
        filterInput.removeEventListener("change", onFilterChange);
        filterInput.removeEventListener("valueChange", onFilterChange);
        dropdown.removeEventListener("selection-changed", onSelectionChanged);
        table.removeEventListener("sort-field-updated", onSortFieldUpdated);
        table.removeEventListener("sort-order-updated", onSortOrderUpdated);
      };
    };

    setup();

    return () => {
      mounted = false;
      if (tableRef.current?.__cleanup) {
        tableRef.current.__cleanup();
      }
    };
  }, []);

  const resetTable = async () => {
    const table = tableRef.current;
    const sortField = sortFieldRef.current;
    const sortOrder = sortOrderRef.current;
    const filterInput = filterInputRef.current;
    const dropdown = dropdownRef.current;

    if (!table) return;

    if (typeof table.resetSort === "function") {
      await table.resetSort();
    }

    if (sortField) sortField.value = "";
    if (sortOrder) {
      sortOrder.value = "asc";
      sortOrder.disabled = true;
    }

    if (filterInput) {
      filterInput.value = "";
      filterInput.dispatchEvent(new Event("input", { bubbles: true }));
      filterInput.dispatchEvent(
        new CustomEvent("valueChange", {
          detail: { value: "" },
          bubbles: true,
        })
      );
    }

    if (dropdown?.clearSelections) {
      await dropdown.clearSelections();
    }

    document.dispatchEvent(
      new CustomEvent("filter-fields-changed", {
        detail: { tableId: "table-playground", items: [] },
      })
    );
  };

  const clearFilter = async () => {
    const table = tableRef.current;
    const filterInput = filterInputRef.current;
    const dropdown = dropdownRef.current;

    if (filterInput) {
      filterInput.value = "";
      filterInput.dispatchEvent(new Event("input", { bubbles: true }));
      filterInput.dispatchEvent(
        new CustomEvent("valueChange", {
          detail: { value: "" },
          bubbles: true,
        })
      );
    }

    if (dropdown?.clearSelections) {
      await dropdown.clearSelections();
    }

    document.dispatchEvent(
      new CustomEvent("filter-fields-changed", {
        detail: { tableId: "table-playground", items: [] },
      })
    );

    table?.dispatchEvent(
      new CustomEvent("filter-changed", {
        detail: { value: "" },
        bubbles: true,
      })
    );
  };

  return (
    <section className="display-box-demo">
      <button type="button" className="reset-sort-icon" onClick={resetTable}>
        Reset
      </button>

      <div style={{ display: "flex", width: "100%", flex: "1 1 auto" }}>
        <div style={{ flex: "1 1 auto" }}>
          <select-field-component
            ref={sortFieldRef}
            label="Sort Field"
            with-table
            size="sm"
          ></select-field-component>
        </div>

        <div style={{ flex: "1 1 auto" }}>
          <select-field-component
            ref={sortOrderRef}
            label="Sort Order"
            with-table
            value="asc"
            disabled
            size="sm"
          ></select-field-component>
        </div>
      </div>

      <div style={{ display: "flex", width: "100%", flex: "1 1 auto" }}>
        <div style={{ flex: "1 1 auto" }}>
          <input-group-component
            ref={filterInputRef}
            label="Filter"
            placeholder="Type to Filter..."
            name="input-1"
            value=""
            append
            append-id="append-1"
            other-content
            size="sm"
          >
            <button-component
              btn-text="Clear"
              variant="primary"
              slot="append"
              secondary
              styles="border-radius: 0 3px 3px 0; padding: 0 8px;"
              size="sm"
              onClick={clearFilter}
            ></button-component>
          </input-group-component>
        </div>

        <div style={{ flex: "1 1 auto", marginTop: "1.870rem" }}>
          <dropdown-component
            ref={dropdownRef}
            button-text="Filter By"
            variant="secondary"
            table-id="table-playground"
            size="sm"
            input-id="filterby"
            list-type="checkboxes"
          ></dropdown-component>
        </div>
      </div>

      <table-component
        ref={tableRef}
        id="table-playground"
        table-id="table-playground"
        striped
        row-hover
        sortable
        responsive
        select-mode="multi"
        pagination-enabled
        pagination-variant="standard"
        pagination-position="both"
        pagination-limit="3"
        pagination-layout="start"
        show-size-changer
        size="sm"
        go-to-buttons="text"
        rows-per-page="10"
      ></table-component>
    </section>
  );
}
`;

export const vueExample = `<template>
  <table-component
    ref="tableRef"
    responsive
    striped
    sortable
    pagination-enabled
    pagination-variant="standard"
    pagination-position="bottom"
    rows-per-page="10"
    size="sm"
  ></table-component>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const tableRef = ref(null);

const items = [
  { last_name: 'MacDonald', first_name: 'Thor', age: 40 },
  { last_name: 'Smith', first_name: 'Anna', age: 25 },
  { last_name: 'Peterson', first_name: 'Zachary', age: 36 },
];

const fields = [
  { key: 'last_name', label: 'Last Name', sortable: true },
  { key: 'first_name', label: 'First Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
];

onMounted(async () => {
  await customElements.whenDefined('table-component');
  const table = tableRef.value;
  if (!table) return;

  table.items = items;
  table.originalItems = [...items];
  table.fields = fields;
});
</script>
`;

export const vuePlaygroundExample = `<template>
  <section class="display-box-demo">
    <button type="button" class="reset-sort-icon" @click="resetTable">Reset</button>

    <div style="display: flex; width: 100%; flex: 1 1 auto">
      <div style="flex: 1 1 auto">
        <select-field-component
          ref="sortFieldRef"
          label="Sort Field"
          with-table
          size="sm"
        ></select-field-component>
      </div>

      <div style="flex: 1 1 auto">
        <select-field-component
          ref="sortOrderRef"
          label="Sort Order"
          with-table
          value="asc"
          disabled
          size="sm"
        ></select-field-component>
      </div>
    </div>

    <div style="display: flex; width: 100%; flex: 1 1 auto">
      <div style="flex: 1 1 auto">
        <input-group-component
          ref="filterInputRef"
          label="Filter"
          placeholder="Type to Filter..."
          name="input-1"
          value=""
          append
          append-id="append-1"
          other-content
          size="sm"
        >
          <button-component
            btn-text="Clear"
            variant="primary"
            slot="append"
            secondary
            styles="border-radius: 0 3px 3px 0; padding: 0 8px;"
            size="sm"
            @click="clearFilter"
          ></button-component>
        </input-group-component>
      </div>

      <div style="flex: 1 1 auto; margin-top: 1.870rem">
        <dropdown-component
          ref="dropdownRef"
          button-text="Filter By"
          variant="secondary"
          table-id="table-playground"
          size="sm"
          input-id="filterby"
          list-type="checkboxes"
        ></dropdown-component>
      </div>
    </div>

    <table-component
      ref="tableRef"
      id="table-playground"
      table-id="table-playground"
      striped
      row-hover
      sortable
      responsive
      select-mode="multi"
      pagination-enabled
      pagination-variant="standard"
      pagination-position="both"
      pagination-limit="3"
      pagination-layout="start"
      show-size-changer
      size="sm"
      go-to-buttons="text"
      rows-per-page="10"
    ></table-component>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const tableRef = ref(null);
const sortFieldRef = ref(null);
const sortOrderRef = ref(null);
const filterInputRef = ref(null);
const dropdownRef = ref(null);

const items = [
  { age: 40, first_name: "Thor", last_name: "MacDonald", _showDetails: true, _additionalInfo: "<p>Hello \${this.first_name}, Age: \${this.age}</p>" },
  { age: 20, first_name: "Pete", last_name: "MacDonald", _showDetails: true, _additionalInfo: "<p>Hello \${this.first_name}, Age: \${this.age}</p>" },
  { age: 25, first_name: "Anna", last_name: "Smith", _showDetails: true, _additionalInfo: "<p>Hello \${this.first_name}, Age: \${this.age}</p>" },
  { age: 36, first_name: "Zachary", last_name: "Peterson" },
  { age: 21, first_name: "Ralph", last_name: "MacDonald" },
  { age: 34, first_name: "Norma", last_name: "MacDonald" },
  { age: 25, first_name: "Emily", last_name: "Larson" },
  { age: 49, first_name: "Clark", last_name: "Griswald" },
  { age: 37, first_name: "George", last_name: "Jefferson" },
  { age: 30, first_name: "Patrick", last_name: "Adams" },
  { age: 19, first_name: "Keith", last_name: "Ericksen" },
  { age: 28, first_name: "Kelly", last_name: "Parker" },
  { age: 87, first_name: "Robert", last_name: "Mitchell" },
  { age: 30, first_name: "Derrick", last_name: "Clark" },
  { age: 54, first_name: "Rosa", last_name: "Gonzalez" },
];

const fields = [
  { key: "last_name", label: "Last Name", sortable: true },
  { key: "first_name", label: "First Name", sortable: true },
  { key: "age", label: "Age", sortable: true },
];

let cleanup = null;

onMounted(async () => {
  await Promise.all([
    customElements.whenDefined("table-component"),
    customElements.whenDefined("select-field-component"),
    customElements.whenDefined("input-group-component"),
    customElements.whenDefined("dropdown-component"),
  ]);

  const table = tableRef.value;
  const sortField = sortFieldRef.value;
  const sortOrder = sortOrderRef.value;
  const filterInput = filterInputRef.value;
  const dropdown = dropdownRef.value;

  if (!table || !sortField || !sortOrder || !filterInput || !dropdown) return;

  if (typeof table.componentOnReady === "function") await table.componentOnReady();
  if (typeof sortField.componentOnReady === "function") await sortField.componentOnReady();
  if (typeof sortOrder.componentOnReady === "function") await sortOrder.componentOnReady();
  if (typeof filterInput.componentOnReady === "function") await filterInput.componentOnReady();
  if (typeof dropdown.componentOnReady === "function") await dropdown.componentOnReady();

  table.items = [...items];
  table.originalItems = [...items];
  table.fields = [...fields];

  sortField.defaultOptionTxt = "";
  sortField.options = fields.map((field) => ({
    value: field.key,
    name: field.label,
  }));

  sortOrder.options = [
    { value: "asc", name: "Ascending" },
    { value: "desc", name: "Descending" },
  ];
  sortOrder.value = "asc";
  sortOrder.disabled = true;

  const dropdownOptions = fields.map((field, index) => ({
    key: field.key,
    name: field.label,
    value: field.key,
    label: field.label,
    checked: false,
    index,
  }));

  if (typeof dropdown.setOptions === "function") {
    dropdown.setOptions(dropdownOptions);
  } else {
    dropdown.options = dropdownOptions;
  }

  const onSortFieldChange = (ev) => {
    const value = ev?.detail?.value ?? ev?.target?.value ?? "";
    const normalized = value && value !== "none" ? value : "none";
    sortOrder.disabled = normalized === "none";
    table.dispatchEvent(
      new CustomEvent("sort-field-changed", {
        detail: { value: normalized },
        bubbles: true,
      })
    );
  };

  const onSortOrderChange = (ev) => {
    const value = ev?.detail?.value ?? ev?.target?.value ?? "asc";
    table.dispatchEvent(
      new CustomEvent("sort-order-changed", {
        detail: { value },
        bubbles: true,
      })
    );
  };

  const onFilterChange = (ev) => {
    const value = ev?.detail?.value ?? ev?.target?.value ?? "";
    table.dispatchEvent(
      new CustomEvent("filter-changed", {
        detail: { value: String(value) },
        bubbles: true,
      })
    );
  };

  const onSelectionChanged = (ev) => {
    const checked = Array.isArray(ev?.detail?.items) ? ev.detail.items : [];
    const selected = checked
      .filter((item) => item.checked)
      .map((item) => ({ key: item.key || item.value || item.name, checked: true }));

    document.dispatchEvent(
      new CustomEvent("filter-fields-changed", {
        detail: {
          tableId: "table-playground",
          items: selected,
        },
      })
    );
  };

  const onSortFieldUpdated = (ev) => {
    const value = ev?.detail?.value ?? "none";
    sortField.value = value === "none" ? "" : value;
    sortOrder.disabled = value === "none";
  };

  const onSortOrderUpdated = (ev) => {
    const value = ev?.detail?.value ?? "asc";
    sortOrder.value = value;
    if (sortField.value) sortOrder.disabled = false;
  };

  sortField.addEventListener("valueChange", onSortFieldChange);
  sortField.addEventListener("change", onSortFieldChange);
  sortOrder.addEventListener("valueChange", onSortOrderChange);
  sortOrder.addEventListener("change", onSortOrderChange);
  filterInput.addEventListener("input", onFilterChange);
  filterInput.addEventListener("change", onFilterChange);
  filterInput.addEventListener("valueChange", onFilterChange);
  dropdown.addEventListener("selection-changed", onSelectionChanged);
  table.addEventListener("sort-field-updated", onSortFieldUpdated);
  table.addEventListener("sort-order-updated", onSortOrderUpdated);

  cleanup = () => {
    sortField.removeEventListener("valueChange", onSortFieldChange);
    sortField.removeEventListener("change", onSortFieldChange);
    sortOrder.removeEventListener("valueChange", onSortOrderChange);
    sortOrder.removeEventListener("change", onSortOrderChange);
    filterInput.removeEventListener("input", onFilterChange);
    filterInput.removeEventListener("change", onFilterChange);
    filterInput.removeEventListener("valueChange", onFilterChange);
    dropdown.removeEventListener("selection-changed", onSelectionChanged);
    table.removeEventListener("sort-field-updated", onSortFieldUpdated);
    table.removeEventListener("sort-order-updated", onSortOrderUpdated);
  };
});

onBeforeUnmount(() => {
  if (cleanup) cleanup();
});

async function resetTable() {
  const table = tableRef.value;
  const sortField = sortFieldRef.value;
  const sortOrder = sortOrderRef.value;
  const filterInput = filterInputRef.value;
  const dropdown = dropdownRef.value;

  if (!table) return;

  if (typeof table.resetSort === "function") {
    await table.resetSort();
  }

  if (sortField) sortField.value = "";
  if (sortOrder) {
    sortOrder.value = "asc";
    sortOrder.disabled = true;
  }

  if (filterInput) {
    filterInput.value = "";
    filterInput.dispatchEvent(new Event("input", { bubbles: true }));
    filterInput.dispatchEvent(
      new CustomEvent("valueChange", {
        detail: { value: "" },
        bubbles: true,
      })
    );
  }

  if (dropdown?.clearSelections) {
    await dropdown.clearSelections();
  }

  document.dispatchEvent(
    new CustomEvent("filter-fields-changed", {
      detail: { tableId: "table-playground", items: [] },
    })
  );
}

async function clearFilter() {
  const table = tableRef.value;
  const filterInput = filterInputRef.value;
  const dropdown = dropdownRef.value;

  if (filterInput) {
    filterInput.value = "";
    filterInput.dispatchEvent(new Event("input", { bubbles: true }));
    filterInput.dispatchEvent(
      new CustomEvent("valueChange", {
        detail: { value: "" },
        bubbles: true,
      })
    );
  }

  if (dropdown?.clearSelections) {
    await dropdown.clearSelections();
  }

  document.dispatchEvent(
    new CustomEvent("filter-fields-changed", {
      detail: { tableId: "table-playground", items: [] },
    })
  );

  table?.dispatchEvent(
    new CustomEvent("filter-changed", {
      detail: { value: "" },
      bubbles: true,
    })
  );
}
</script>
`;

export const angularExample = `import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-table-component-example',
  template: \`
    <table-component
      #tableRef
      responsive
      striped
      sortable
      pagination-enabled
      pagination-variant="standard"
      pagination-position="bottom"
      rows-per-page="10"
      size="sm"
    ></table-component>
  \`,
})
export class TableComponentExampleComponent implements AfterViewInit {
  @ViewChild('tableRef', { static: true }) tableRef!: ElementRef;

  private items = [
    { last_name: 'MacDonald', first_name: 'Thor', age: 40 },
    { last_name: 'Smith', first_name: 'Anna', age: 25 },
    { last_name: 'Peterson', first_name: 'Zachary', age: 36 },
  ];

  private fields = [
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ];

  async ngAfterViewInit(): Promise<void> {
    await customElements.whenDefined('table-component');

    const table = this.tableRef.nativeElement;
    table.items = this.items;
    table.originalItems = [...this.items];
    table.fields = this.fields;
  }
}
`;

export const angularPlaygroundExample = `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-table-playground-example',
  template: \`
    <section class="display-box-demo">
      <button type="button" class="reset-sort-icon" (click)="resetTable()">Reset</button>

      <div style="display:flex; width:100%; flex:1 1 auto">
        <div style="flex:1 1 auto">
          <select-field-component
            #sortFieldRef
            label="Sort Field"
            with-table
            size="sm"
          ></select-field-component>
        </div>

        <div style="flex:1 1 auto">
          <select-field-component
            #sortOrderRef
            label="Sort Order"
            with-table
            value="asc"
            disabled
            size="sm"
          ></select-field-component>
        </div>
      </div>

      <div style="display:flex; width:100%; flex:1 1 auto">
        <div style="flex:1 1 auto">
          <input-group-component
            #filterInputRef
            label="Filter"
            placeholder="Type to Filter..."
            name="input-1"
            value=""
            append
            append-id="append-1"
            other-content
            size="sm"
          >
            <button-component
              btn-text="Clear"
              variant="primary"
              slot="append"
              secondary
              styles="border-radius: 0 3px 3px 0; padding: 0 8px;"
              size="sm"
              (click)="clearFilter()"
            ></button-component>
          </input-group-component>
        </div>

        <div style="flex:1 1 auto; margin-top:1.870rem">
          <dropdown-component
            #dropdownRef
            button-text="Filter By"
            variant="secondary"
            table-id="table-playground"
            size="sm"
            input-id="filterby"
            list-type="checkboxes"
          ></dropdown-component>
        </div>
      </div>

      <table-component
        #tableRef
        id="table-playground"
        table-id="table-playground"
        striped
        row-hover
        sortable
        responsive
        select-mode="multi"
        pagination-enabled
        pagination-variant="standard"
        pagination-position="both"
        pagination-limit="3"
        pagination-layout="start"
        show-size-changer
        size="sm"
        go-to-buttons="text"
        rows-per-page="10"
      ></table-component>
    </section>
  \`,
})

export class TablePlaygroundExampleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tableRef', { static: false }) tableRef!: ElementRef;
  @ViewChild('sortFieldRef', { static: false }) sortFieldRef!: ElementRef;
  @ViewChild('sortOrderRef', { static: false }) sortOrderRef!: ElementRef;
  @ViewChild('filterInputRef', { static: false }) filterInputRef!: ElementRef;
  @ViewChild('dropdownRef', { static: false }) dropdownRef!: ElementRef;

  private readonly items = [
    { age: 40, first_name: 'Thor', last_name: 'MacDonald', _showDetails: true, _additionalInfo: '<p>Hello \${this.first_name}, Age: \${this.age}</p>' },
    { age: 20, first_name: 'Pete', last_name: 'MacDonald', _showDetails: true, _additionalInfo: '<p>Hello \${this.first_name}, Age: \${this.age}</p>' },
    { age: 25, first_name: 'Anna', last_name: 'Smith', _showDetails: true, _additionalInfo: '<p>Hello \${this.first_name}, Age: \${this.age}</p>' },
    { age: 36, first_name: 'Zachary', last_name: 'Peterson' },
    { age: 21, first_name: 'Ralph', last_name: 'MacDonald' },
    { age: 34, first_name: 'Norma', last_name: 'MacDonald' },
    { age: 25, first_name: 'Emily', last_name: 'Larson' },
    { age: 49, first_name: 'Clark', last_name: 'Griswald' },
    { age: 37, first_name: 'George', last_name: 'Jefferson' },
    { age: 30, first_name: 'Patrick', last_name: 'Adams' },
    { age: 19, first_name: 'Keith', last_name: 'Ericksen' },
    { age: 28, first_name: 'Kelly', last_name: 'Parker' },
    { age: 87, first_name: 'Robert', last_name: 'Mitchell' },
    { age: 30, first_name: 'Derrick', last_name: 'Clark' },
    { age: 54, first_name: 'Rosa', last_name: 'Gonzalez' },
  ];

  private readonly fields = [
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ];

  private cleanupFns: Array<() => void> = [];

  async ngAfterViewInit(): Promise<void> {
    await Promise.all([
      customElements.whenDefined('table-component'),
      customElements.whenDefined('select-field-component'),
      customElements.whenDefined('input-group-component'),
      customElements.whenDefined('dropdown-component'),
    ]);

    const table = this.tableRef?.nativeElement;
    const sortField = this.sortFieldRef?.nativeElement;
    const sortOrder = this.sortOrderRef?.nativeElement;
    const filterInput = this.filterInputRef?.nativeElement;
    const dropdown = this.dropdownRef?.nativeElement;

    if (!table || !sortField || !sortOrder || !filterInput || !dropdown) return;

    if (typeof table.componentOnReady === 'function') await table.componentOnReady();
    if (typeof sortField.componentOnReady === 'function') await sortField.componentOnReady();
    if (typeof sortOrder.componentOnReady === 'function') await sortOrder.componentOnReady();
    if (typeof filterInput.componentOnReady === 'function') await filterInput.componentOnReady();
    if (typeof dropdown.componentOnReady === 'function') await dropdown.componentOnReady();

    table.items = [...this.items];
    table.originalItems = [...this.items];
    table.fields = [...this.fields];

    sortField.defaultOptionTxt = '';
    sortField.options = this.fields.map(field => ({
      value: field.key,
      name: field.label,
    }));

    sortOrder.options = [
      { value: 'asc', name: 'Ascending' },
      { value: 'desc', name: 'Descending' },
    ];
    sortOrder.value = 'asc';
    sortOrder.disabled = true;

    const dropdownOptions = this.fields.map((field, index) => ({
      key: field.key,
      name: field.label,
      value: field.key,
      label: field.label,
      checked: false,
      index,
    }));

    if (typeof dropdown.setOptions === 'function') {
      dropdown.setOptions(dropdownOptions);
    } else {
      dropdown.options = dropdownOptions;
    }

    const onSortFieldChange = (ev: any) => {
      const value = ev?.detail?.value ?? ev?.target?.value ?? '';
      const normalized = value && value !== 'none' ? value : 'none';
      sortOrder.disabled = normalized === 'none';

      table.dispatchEvent(
        new CustomEvent('sort-field-changed', {
          detail: { value: normalized },
          bubbles: true,
        }),
      );
    };

    const onSortOrderChange = (ev: any) => {
      const value = ev?.detail?.value ?? ev?.target?.value ?? 'asc';

      table.dispatchEvent(
        new CustomEvent('sort-order-changed', {
          detail: { value },
          bubbles: true,
        }),
      );
    };

    const onFilterChange = (ev: any) => {
      const value = ev?.detail?.value ?? ev?.target?.value ?? '';

      table.dispatchEvent(
        new CustomEvent('filter-changed', {
          detail: { value: String(value) },
          bubbles: true,
        }),
      );
    };

    const onSelectionChanged = (ev: any) => {
      const checked = Array.isArray(ev?.detail?.items) ? ev.detail.items : [];
      const selected = checked
        .filter((item: any) => item.checked)
        .map((item: any) => ({
          key: item.key || item.value || item.name,
          checked: true,
        }));

      document.dispatchEvent(
        new CustomEvent('filter-fields-changed', {
          detail: {
            tableId: 'table-playground',
            items: selected,
          },
        }),
      );
    };

    const onSortFieldUpdated = (ev: any) => {
      const value = ev?.detail?.value ?? 'none';
      sortField.value = value === 'none' ? '' : value;
      sortOrder.disabled = value === 'none';
    };

    const onSortOrderUpdated = (ev: any) => {
      const value = ev?.detail?.value ?? 'asc';
      sortOrder.value = value;
      if (sortField.value) sortOrder.disabled = false;
    };

    sortField.addEventListener('valueChange', onSortFieldChange);
    sortField.addEventListener('change', onSortFieldChange);
    sortOrder.addEventListener('valueChange', onSortOrderChange);
    sortOrder.addEventListener('change', onSortOrderChange);
    filterInput.addEventListener('input', onFilterChange);
    filterInput.addEventListener('change', onFilterChange);
    filterInput.addEventListener('valueChange', onFilterChange);
    dropdown.addEventListener('selection-changed', onSelectionChanged);
    table.addEventListener('sort-field-updated', onSortFieldUpdated);
    table.addEventListener('sort-order-updated', onSortOrderUpdated);

    this.cleanupFns.push(() => sortField.removeEventListener('valueChange', onSortFieldChange));
    this.cleanupFns.push(() => sortField.removeEventListener('change', onSortFieldChange));
    this.cleanupFns.push(() => sortOrder.removeEventListener('valueChange', onSortOrderChange));
    this.cleanupFns.push(() => sortOrder.removeEventListener('change', onSortOrderChange));
    this.cleanupFns.push(() => filterInput.removeEventListener('input', onFilterChange));
    this.cleanupFns.push(() => filterInput.removeEventListener('change', onFilterChange));
    this.cleanupFns.push(() => filterInput.removeEventListener('valueChange', onFilterChange));
    this.cleanupFns.push(() => dropdown.removeEventListener('selection-changed', onSelectionChanged));
    this.cleanupFns.push(() => table.removeEventListener('sort-field-updated', onSortFieldUpdated));
    this.cleanupFns.push(() => table.removeEventListener('sort-order-updated', onSortOrderUpdated));
  }

  async resetTable(): Promise<void> {
    const table = this.tableRef?.nativeElement;
    const sortField = this.sortFieldRef?.nativeElement;
    const sortOrder = this.sortOrderRef?.nativeElement;
    const filterInput = this.filterInputRef?.nativeElement;
    const dropdown = this.dropdownRef?.nativeElement;

    if (!table) return;

    if (typeof table.resetSort === 'function') {
      await table.resetSort();
    }

    if (sortField) sortField.value = '';
    if (sortOrder) {
      sortOrder.value = 'asc';
      sortOrder.disabled = true;
    }

    if (filterInput) {
      filterInput.value = '';
      filterInput.dispatchEvent(new Event('input', { bubbles: true }));
      filterInput.dispatchEvent(
        new CustomEvent('valueChange', {
          detail: { value: '' },
          bubbles: true,
        }),
      );
    }

    if (dropdown?.clearSelections) {
      await dropdown.clearSelections();
    }

    document.dispatchEvent(
      new CustomEvent('filter-fields-changed', {
        detail: { tableId: 'table-playground', items: [] },
      }),
    );
  }

  async clearFilter(): Promise<void> {
    const table = this.tableRef?.nativeElement;
    const filterInput = this.filterInputRef?.nativeElement;
    const dropdown = this.dropdownRef?.nativeElement;

    if (filterInput) {
      filterInput.value = '';
      filterInput.dispatchEvent(new Event('input', { bubbles: true }));
      filterInput.dispatchEvent(
        new CustomEvent('valueChange', {
          detail: { value: '' },
          bubbles: true,
        }),
      );
    }

    if (dropdown?.clearSelections) {
      await dropdown.clearSelections();
    }

    document.dispatchEvent(
      new CustomEvent('filter-fields-changed', {
        detail: { tableId: 'table-playground', items: [] },
      }),
    );

    table?.dispatchEvent(
      new CustomEvent('filter-changed', {
        detail: { value: '' },
        bubbles: true,
      }),
    );
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}
`;

export const svelteExample = `<script>
  import { onMount } from 'svelte';

  type TableField = {
    key: string;
    label: string;
    sortable?: boolean;
  };

  type TableItem = {
    last_name: string;
    first_name: string;
    age: number;
  };

  type TableComponentElement = HTMLElement & {
    componentOnReady?: () => Promise<void>;
    items: TableItem[];
    originalItems: TableItem[];
    fields: TableField[];
  };

  let tableEl: TableComponentElement | null = null;

  const items: TableItem[] = [
    { last_name: "MacDonald", first_name: "Thor", age: 40 },
    { last_name: "Smith", first_name: "Anna", age: 25 },
    { last_name: "Peterson", first_name: "Zachary", age: 36 },
  ];

  const fields: TableField[] = [
    { key: "last_name", label: "Last Name", sortable: true },
    { key: "first_name", label: "First Name", sortable: true },
    { key: "age", label: "Age", sortable: true },
  ];

  onMount(async () => {
    await customElements.whenDefined("table-component");
    if (!tableEl) return;

    if (typeof tableEl.componentOnReady === "function") {
      await tableEl.componentOnReady();
    }

    tableEl.items = [...items];
    tableEl.originalItems = [...items];
    tableEl.fields = [...fields];
  });
</script>

<section>
  <h2>Table Component Example</h2>

  <table-component
    bind:this={tableEl}
    responsive
    striped
    sortable
    pagination-enabled
    pagination-variant="standard"
    pagination-position="bottom"
    rows-per-page="10"
    size="sm"
  ></table-component>
</section>
`;

export const sveltePlaygroundExample = `<script>
  import { onMount } from 'svelte';

    let tableEl;
  let sortFieldEl;
  let sortOrderEl;
  let filterInputEl;
  let dropdownEl;

  const tableId = 'table-playground';

  const items = [
    { age: 40, first_name: 'Thor', last_name: 'MacDonald', _showDetails: true, _additionalInfo: '<p>Hello \${this.first_name}, Age: \${this.age}</p>' },
    { age: 20, first_name: 'Pete', last_name: 'MacDonald', _showDetails: true, _additionalInfo: '<p>Hello \${this.first_name}, Age: \${this.age}</p>' },
    { age: 25, first_name: 'Anna', last_name: 'Smith', _showDetails: true, _additionalInfo: '<p>Hello \${this.first_name}, Age: \${this.age}</p>' },
    { age: 36, first_name: 'Zachary', last_name: 'Peterson' },
    { age: 21, first_name: 'Ralph', last_name: 'MacDonald' },
    { age: 34, first_name: 'Norma', last_name: 'MacDonald' },
    { age: 25, first_name: 'Emily', last_name: 'Larson' },
    { age: 49, first_name: 'Clark', last_name: 'Griswald' },
    { age: 37, first_name: 'George', last_name: 'Jefferson' },
    { age: 30, first_name: 'Patrick', last_name: 'Adams' },
    { age: 19, first_name: 'Keith', last_name: 'Ericksen' },
    { age: 28, first_name: 'Kelly', last_name: 'Parker' },
    { age: 87, first_name: 'Robert', last_name: 'Mitchell' },
    { age: 30, first_name: 'Derrick', last_name: 'Clark' },
    { age: 54, first_name: 'Rosa', last_name: 'Gonzalez' },
  ];

  const fields = [
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ];

  let cleanup = () => {};

  onMount(() => {
  let disposed = false;

  (async () => {
    await Promise.all([
      customElements.whenDefined('table-component'),
      customElements.whenDefined('select-field-component'),
      customElements.whenDefined('input-group-component'),
      customElements.whenDefined('dropdown-component'),
    ]);

    if (disposed || !tableEl || !sortFieldEl || !sortOrderEl || !filterInputEl || !dropdownEl) return;

    if (typeof tableEl.componentOnReady === 'function') await tableEl.componentOnReady();
    if (typeof sortFieldEl.componentOnReady === 'function') await sortFieldEl.componentOnReady();
    if (typeof sortOrderEl.componentOnReady === 'function') await sortOrderEl.componentOnReady();
    if (typeof filterInputEl.componentOnReady === 'function') await filterInputEl.componentOnReady();
    if (typeof dropdownEl.componentOnReady === 'function') await dropdownEl.componentOnReady();

    tableEl.items = [...items];
    tableEl.originalItems = [...items];
    tableEl.fields = [...fields];

    sortFieldEl.defaultOptionTxt = '';
    sortFieldEl.options = fields.map((field) => ({
      value: field.key,
      name: field.label,
    }));

    sortOrderEl.options = [
      { value: 'asc', name: 'Ascending' },
      { value: 'desc', name: 'Descending' },
    ];
    sortOrderEl.value = 'asc';
    sortOrderEl.disabled = true;

    const dropdownOptions = fields.map((field, index) => ({
      key: field.key,
      name: field.label,
      value: field.key,
      label: field.label,
      checked: false,
      index,
    }));

    if (typeof dropdownEl.setOptions === 'function') {
      dropdownEl.setOptions(dropdownOptions);
    } else {
      dropdownEl.options = dropdownOptions;
    }

    const onSortFieldChange = (ev: any) => {
      const value = ev?.detail?.value ?? ev?.target?.value ?? '';
      const normalized = value && value !== 'none' ? value : 'none';
      sortOrderEl.disabled = normalized === 'none';

      tableEl.dispatchEvent(
        new CustomEvent('sort-field-changed', {
          detail: { value: normalized },
          bubbles: true,
        }),
      );
    };

    const onSortOrderChange = (ev: any) => {
      const value = ev?.detail?.value ?? ev?.target?.value ?? 'asc';

      tableEl.dispatchEvent(
        new CustomEvent('sort-order-changed', {
          detail: { value },
          bubbles: true,
        }),
      );
    };

    const onFilterChange = (ev: any) => {
      const value = ev?.detail?.value ?? ev?.target?.value ?? '';

      tableEl.dispatchEvent(
        new CustomEvent('filter-changed', {
          detail: { value: String(value) },
          bubbles: true,
        }),
      );
    };

    const onSelectionChanged = (ev: any) => {
      const checked = Array.isArray(ev?.detail?.items) ? ev.detail.items : [];
      const selected = checked
        .filter((item: any) => item.checked)
        .map((item: any) => ({
          key: item.key || item.value || item.name,
          checked: true,
        }));

      document.dispatchEvent(
        new CustomEvent('filter-fields-changed', {
          detail: {
            tableId,
            items: selected,
          },
        }),
      );
    };

    const onSortFieldUpdated = (ev: any) => {
      const value = ev?.detail?.value ?? 'none';
      sortFieldEl.value = value === 'none' ? '' : value;
      sortOrderEl.disabled = value === 'none';
    };

    const onSortOrderUpdated = (ev: any) => {
      const value = ev?.detail?.value ?? 'asc';
      sortOrderEl.value = value;
      if (sortFieldEl.value) sortOrderEl.disabled = false;
    };

    sortFieldEl.addEventListener('valueChange', onSortFieldChange);
    sortFieldEl.addEventListener('change', onSortFieldChange);
    sortOrderEl.addEventListener('valueChange', onSortOrderChange);
    sortOrderEl.addEventListener('change', onSortOrderChange);
    filterInputEl.addEventListener('input', onFilterChange);
    filterInputEl.addEventListener('change', onFilterChange);
    filterInputEl.addEventListener('valueChange', onFilterChange);
    dropdownEl.addEventListener('selection-changed', onSelectionChanged);
    tableEl.addEventListener('sort-field-updated', onSortFieldUpdated);
    tableEl.addEventListener('sort-order-updated', onSortOrderUpdated);

    cleanup = () => {
      sortFieldEl?.removeEventListener('valueChange', onSortFieldChange);
      sortFieldEl?.removeEventListener('change', onSortFieldChange);
      sortOrderEl?.removeEventListener('valueChange', onSortOrderChange);
      sortOrderEl?.removeEventListener('change', onSortOrderChange);
      filterInputEl?.removeEventListener('input', onFilterChange);
      filterInputEl?.removeEventListener('change', onFilterChange);
      filterInputEl?.removeEventListener('valueChange', onFilterChange);
      dropdownEl?.removeEventListener('selection-changed', onSelectionChanged);
      tableEl?.removeEventListener('sort-field-updated', onSortFieldUpdated);
      tableEl?.removeEventListener('sort-order-updated', onSortOrderUpdated);
    };
  })();

  return () => {
    disposed = true;
    cleanup();
  };
});

  async function resetTable() {
    if (!tableEl) return;

    if (typeof tableEl.resetSort === 'function') {
      await tableEl.resetSort();
    }

    if (sortFieldEl) sortFieldEl.value = '';
    if (sortOrderEl) {
      sortOrderEl.value = 'asc';
      sortOrderEl.disabled = true;
    }

    if (filterInputEl) {
      filterInputEl.value = '';
      filterInputEl.dispatchEvent(new Event('input', { bubbles: true }));
      filterInputEl.dispatchEvent(
        new CustomEvent('valueChange', {
          detail: { value: '' },
          bubbles: true,
        }),
      );
    }

    if (dropdownEl?.clearSelections) {
      await dropdownEl.clearSelections();
    }

    document.dispatchEvent(
      new CustomEvent('filter-fields-changed', {
        detail: { tableId, items: [] },
      }),
    );
  }

  async function clearFilter() {
    if (filterInputEl) {
      filterInputEl.value = '';
      filterInputEl.dispatchEvent(new Event('input', { bubbles: true }));
      filterInputEl.dispatchEvent(
        new CustomEvent('valueChange', {
          detail: { value: '' },
          bubbles: true,
        }),
      );
    }

    if (dropdownEl?.clearSelections) {
      await dropdownEl.clearSelections();
    }

    document.dispatchEvent(
      new CustomEvent('filter-fields-changed', {
        detail: { tableId, items: [] },
      }),
    );

    tableEl?.dispatchEvent(
      new CustomEvent('filter-changed', {
        detail: { value: '' },
        bubbles: true,
      }),
    );
  }
</script>

<svelte:head>
  <style>
    .display-box-demo {
      margin: 24px 0;
    }
  </style>
</svelte:head>

<section class="display-box-demo">
  <button type="button" class="reset-sort-icon" onclick={resetTable}></button>

  <div style="display:flex; width:100%; flex:1 1 auto">
    <div style="flex:1 1 auto">
      <select-field-component
        bind:this={sortFieldEl}
        label="Sort Field"
        with-table
        size="sm"
      ></select-field-component>
    </div>

    <div style="flex:1 1 auto">
      <select-field-component
        bind:this={sortOrderEl}
        label="Sort Order"
        with-table
        value="asc"
        disabled
        size="sm"
      ></select-field-component>
    </div>
  </div>

  <div style="display:flex; width:100%; flex:1 1 auto">
    <div style="flex:1 1 auto">
      <input-group-component
        bind:this={filterInputEl}
        label="Filter"
        placeholder="Type to Filter..."
        name="input-1"
        value=""
        append
        append-id="append-1"
        other-content
        size="sm"
      >
        <button-component
          btn-text="Clear"
          variant="primary"
          slot="append"
          secondary
          styles="border-radius: 0 3px 3px 0; padding: 0 8px;"
          size="sm"
          onclick={clearFilter}
        ></button-component>
      </input-group-component>
    </div>

    <div style="flex:1 1 auto; margin-top:1.870rem">
      <dropdown-component
        bind:this={dropdownEl}
        button-text="Filter By"
        variant="secondary"
        table-id={tableId}
        size="sm"
        input-id="filterby"
        list-type="checkboxes"
      ></dropdown-component>
    </div>
  </div>

  <table-component
    bind:this={tableEl}
    id={tableId}
    table-id={tableId}
    striped
    row-hover
    sortable
    responsive
    select-mode="multi"
    pagination-enabled
    pagination-variant="standard"
    pagination-position="both"
    pagination-limit="3"
    pagination-layout="start"
    show-size-changer
    size="sm"
    go-to-buttons="text"
    rows-per-page="10"
  ></table-component>
</section>
`;
