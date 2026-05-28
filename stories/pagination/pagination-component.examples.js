// File: src/stories/pagination-component.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function PaginationComponent() {
  const itemsPerPageRef = useRef(null);

  useEffect(() => {
    if (itemsPerPageRef.current) {
      itemsPerPageRef.current.itemsPerPageOptions = [10, 20, 50, 100, 'All'];
    }
  }, []);

  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <pagination-component
        current-page={1}
        total-rows={100}
        page-size={10}
        pagination-layout="center"
        pagination-aria-label="Pagination"
      ></pagination-component>

      <pagination-component
        ref={itemsPerPageRef}
        current-page={1}
        total-rows={420}
        page-size={20}
        items-per-page
        display-total-number-of-pages
        pagination-layout="start"
        page-size-label="Items per page:"
        page-size-help-text="Use this control to change how many items are shown per page."
      ></pagination-component>

      <pagination-component
        variant="by-page"
        current-page={5}
        total-rows={420}
        page-size={10}
        pagination-layout="center"
        plumage
      ></pagination-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <pagination-component
      current-page="1"
      total-rows="100"
      page-size="10"
      pagination-layout="center"
      pagination-aria-label="Pagination"
    ></pagination-component>

    <pagination-component
      ref="itemsPerPagePagination"
      current-page="1"
      total-rows="420"
      page-size="20"
      items-per-page
      display-total-number-of-pages
      pagination-layout="start"
      page-size-label="Items per page:"
      page-size-help-text="Use this control to change how many items are shown per page."
    ></pagination-component>

    <pagination-component
      variant="by-page"
      current-page="5"
      total-rows="420"
      page-size="10"
      pagination-layout="center"
      plumage
    ></pagination-component>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const itemsPerPagePagination = ref(null);

onMounted(() => {
  if (itemsPerPagePagination.value) {
    itemsPerPagePagination.value.itemsPerPageOptions = [10, 20, 50, 100, 'All'];
  }
});
</script>
`.trim();

export const angularExample = `import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core'

@Component({
  selector: 'app-pagination',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <pagination-component
        current-page="1"
        total-rows="100"
        page-size="10"
        pagination-layout="center"
        pagination-aria-label="Pagination"
      ></pagination-component>

      <pagination-component
        #itemsPerPagePagination
        current-page="1"
        total-rows="420"
        page-size="20"
        items-per-page
        display-total-number-of-pages
        pagination-layout="start"
        page-size-label="Items per page:"
        page-size-help-text="Use this control to change how many items are shown per page."
      ></pagination-component>

      <pagination-component
        variant="by-page"
        current-page="5"
        total-rows="420"
        page-size="10"
        pagination-layout="center"
        plumage
      ></pagination-component>
    </main>
  \`,
})
export class PaginationComponent implements AfterViewInit {
  @ViewChild('itemsPerPagePagination', { static: true }) itemsPerPagePagination!: ElementRef;

  ngAfterViewInit() {
    this.itemsPerPagePagination.nativeElement.itemsPerPageOptions = [10, 20, 50, 100, 'All'];
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let itemsPerPagePagination = null;

  onMount(() => {
    if (itemsPerPagePagination) {
      itemsPerPagePagination.itemsPerPageOptions = [10, 20, 50, 100, 'All'];
    }
  });
</script>

<main style="display:grid; gap:16px;">
  <pagination-component
    current-page="1"
    total-rows="100"
    page-size="10"
    pagination-layout="center"
    pagination-aria-label="Pagination"
  ></pagination-component>

  <pagination-component
    bind:this={itemsPerPagePagination}
    current-page="1"
    total-rows="420"
    page-size="20"
    items-per-page
    display-total-number-of-pages
    pagination-layout="start"
    page-size-label="Items per page:"
    page-size-help-text="Use this control to change how many items are shown per page."
  ></pagination-component>

  <pagination-component
    variant="by-page"
    current-page="5"
    total-rows="420"
    page-size="10"
    pagination-layout="center"
    plumage
  ></pagination-component>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let itemsPerPagePagination = null;

  onMount(() => {
    if (!browser) return;

    if (itemsPerPagePagination) {
      itemsPerPagePagination.itemsPerPageOptions = [10, 20, 50, 100, 'All'];
    }
  });
</script>

{#if browser}
  <main style="display:grid; gap:16px;">
    <pagination-component
      current-page="1"
      total-rows="100"
      page-size="10"
      pagination-layout="center"
      pagination-aria-label="Pagination"
    ></pagination-component>

    <pagination-component
      bind:this={itemsPerPagePagination}
      current-page="1"
      total-rows="420"
      page-size="20"
      items-per-page
      display-total-number-of-pages
      pagination-layout="start"
      page-size-label="Items per page:"
      page-size-help-text="Use this control to change how many items are shown per page."
    ></pagination-component>

    <pagination-component
      variant="by-page"
      current-page="5"
      total-rows="420"
      page-size="10"
      pagination-layout="center"
      plumage
    ></pagination-component>
  </main>
{/if}
`.trim();
