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

export const angularExample = `import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { defineCustomElements } from 'stencil-component-library/loader';

defineCustomElements();

type AccordionContainerItem = {
  header: string;
  content: string;
};

type AccordionContainerElement = HTMLElement & {
  data?: AccordionContainerItem[];
  parentId?: string;
  singleOpen?: boolean;
  variant?: string;
  size?: string;
};

@Component({
  selector: 'app-accordion-container',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <accordion-container
      #accordionEl
      [attr.aria-label]="ariaLabel">
    </accordion-container>
  \`,
})

export class AccordionContainerComponent implements AfterViewInit {
  @ViewChild('accordionEl', { static: true })
  private accordionRef!: ElementRef<AccordionContainerElement>;

  @Input() ariaLabel = 'Account settings sections';
  @Input() parentId = 'angular-accordion-container';
  @Input() singleOpen = true;
  @Input() variant = 'primary';
  @Input() size = 'sm';
  @Input() data: AccordionContainerItem[] = [
    { header: 'Accordion 1', content: 'Content 1' },
    { header: 'Accordion 2', content: 'Content 2' },
    { header: 'Accordion 3', content: 'Content 3' },
  ];

  ngAfterViewInit(): void {
    const el = this.accordionRef.nativeElement;
    el.data = this.data;
    el.parentId = this.parentId;
    el.singleOpen = this.singleOpen;
    el.variant = this.variant;
    el.size = this.size;
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let accordionEl = null;

  const items = [
    { header: 'Accordion 1', content: 'Content 1' },
    { header: 'Accordion 2', content: 'Content 2' },
    { header: 'Accordion 3', content: 'Content 3' },
  ];

  onMount(() => {
    const el = accordionEl;
    if (!el) return;

    el.data = items;
    el.parentId = 'svelte-accordion-container';
    el.singleOpen = true;
    el.variant = 'primary';
    el.size = 'sm';
  });
</script>

<main>
  <accordion-container
    bind:this={accordionEl}
    aria-label="Account settings sections"
  />
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let accordionEl = null;

  const items = [
    { header: 'Accordion 1', content: 'Content 1' },
    { header: 'Accordion 2', content: 'Content 2' },
    { header: 'Accordion 3', content: 'Content 3' },
  ];

  onMount(() => {
    if (!browser) return;

    const el = accordionEl;
    if (!el) return;

    el.data = items;
    el.parentId = 'sveltekit-accordion-container';
    el.singleOpen = true;
    el.variant = 'primary';
    el.size = 'sm';
  });
</script>

{#if browser}
  <main>
    <accordion-container
      bind:this={accordionEl}
      aria-label="Account settings sections"
    />
  </main>
{/if}
`.trim();
