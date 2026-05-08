// File: src/stories/minimize-pagination-component.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function MinimizePagination() {
  const standaloneRef = useRef(null);

  useEffect(() => {
    if (standaloneRef.current) {
      standaloneRef.current.itemsPerPageOptions = [10, 20, 50, 100, 'All'];
    }
  }, []);

  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <minimize-pagination-component
        current-page={1}
        total-rows={100}
        page-size={10}
        pagination-layout="center"
        pagination-aria-label="Pagination"
      ></minimize-pagination-component>

      <minimize-pagination-component
        ref={standaloneRef}
        current-page={1}
        total-rows={420}
        page-size={10}
        items-per-page
        display-total-number-of-pages
        pagination-layout="start"
        page-size-label="Items per page:"
        page-size-help-text="Use this control to change how many items are shown per page."
      ></minimize-pagination-component>

      <minimize-pagination-component
        current-page={8}
        total-rows={250}
        page-size={10}
        go-to-buttons="text"
        plumage
      ></minimize-pagination-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <minimize-pagination-component
      current-page="1"
      total-rows="100"
      page-size="10"
      pagination-layout="center"
      pagination-aria-label="Pagination"
    ></minimize-pagination-component>

    <minimize-pagination-component
      ref="standaloneRef"
      current-page="1"
      total-rows="420"
      page-size="10"
      items-per-page
      display-total-number-of-pages
      pagination-layout="start"
      page-size-label="Items per page:"
      page-size-help-text="Use this control to change how many items are shown per page."
    ></minimize-pagination-component>

    <minimize-pagination-component
      current-page="8"
      total-rows="250"
      page-size="10"
      go-to-buttons="text"
      plumage
    ></minimize-pagination-component>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const standaloneRef = ref(null);

onMounted(() => {
  if (standaloneRef.value) {
    standaloneRef.value.itemsPerPageOptions = [10, 20, 50, 100, 'All'];
  }
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <minimize-pagination-component
        current-page="1"
        total-rows="100"
        page-size="10"
        pagination-layout="center"
        pagination-aria-label="Pagination"
      ></minimize-pagination-component>

      <minimize-pagination-component
        #standaloneRef
        current-page="1"
        total-rows="420"
        page-size="10"
        items-per-page
        display-total-number-of-pages
        pagination-layout="start"
        page-size-label="Items per page:"
        page-size-help-text="Use this control to change how many items are shown per page."
      ></minimize-pagination-component>

      <minimize-pagination-component
        current-page="8"
        total-rows="250"
        page-size="10"
        go-to-buttons="text"
        plumage
      ></minimize-pagination-component>
    </main>
  \`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('standaloneRef', { static: true }) standaloneRef!: ElementRef;

  ngAfterViewInit() {
    this.standaloneRef.nativeElement.itemsPerPageOptions = [10, 20, 50, 100, 'All'];
  }
}
`.trim();
