// File: src/stories/accordion-container/accordion-container.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react'

export default function App() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.data = [
      { header: 'Accordion 1', content: 'Content 1' },
      { header: 'Accordion 2', content: 'Content 2' },
      { header: 'Accordion 3', content: 'Content 3' },
    ]
    el.parentId = 'react-accordion-container'
    el.singleOpen = true
    el.variant = 'primary'
    el.size = 'sm'
  }, [])

  return (
    <main>
      <accordion-container
        ref={ref}
        aria-label="Account settings sections"
      />
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <accordion-container
    ref="accordionEl"
    aria-label="Account settings sections"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { defineCustomElements } from '@your-package/loader';

defineCustomElements();

const accordionEl = ref(null);

const items = [
  { header: 'Accordion 1', content: 'Content 1' },
  { header: 'Accordion 2', content: 'Content 2' },
  { header: 'Accordion 3', content: 'Content 3' },
];

onMounted(() => {
  const el = accordionEl.value;
  if (!el) return;

  el.data = items;
  el.parentId = 'vue-accordion-container';
  el.singleOpen = true;
  el.variant = 'primary';
  el.size = 'sm';
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { defineCustomElements } from '@your-package/loader';

defineCustomElements();

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <accordion-container
      #accordionEl
      aria-label="Account settings sections"
    ></accordion-container>
  \`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('accordionEl', { static: true }) accordionRef;

  ngAfterViewInit() {
    const el = this.accordionRef.nativeElement;

    el.data = [
      { header: 'Accordion 1', content: 'Content 1' },
      { header: 'Accordion 2', content: 'Content 2' },
      { header: 'Accordion 3', content: 'Content 3' },
    ];
    el.parentId = 'angular-accordion-container';
    el.singleOpen = true;
    el.variant = 'primary';
    el.size = 'sm';
  }
}
`.trim();
