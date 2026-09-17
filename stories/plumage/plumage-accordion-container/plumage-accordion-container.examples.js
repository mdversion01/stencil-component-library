// ============================================================================
// File: src/stories/plumage-accordion-container/plumage-accordion-container.examples.js
// ============================================================================

export const reactExample = `
import { useEffect, useRef } from 'react'

export default function PlumageAccordionContainerExample() {
  const plumageAccordionContainerRef = useRef(null)

  useEffect(() => {
    const element = plumageAccordionContainerRef.current
    if (!element) return

    element.data = [
      { header: 'Accordion 1', content: 'Content 1' },
      { header: 'Accordion 2', content: 'Content 2' },
      { header: 'Accordion 3', content: 'Content 3' },
    ]

    element.parentId = 'react-plumage-accordion-container'
    element.singleOpen = true
    element.variant = 'primary'
    element.size = 'sm'
  }, [])

  return (
    <main>
      <plumage-accordion-container
        ref={plumageAccordionContainerRef}
        aria-label="Account settings sections"
      />
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <plumage-accordion-container
    ref="plumageAccordionContainerEl"
    aria-label="Account settings sections"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { defineCustomElements } from '@your-package/loader';

defineCustomElements();

const plumageAccordionContainerEl = ref(null);

const items = [
  { header: 'Accordion 1', content: 'Content 1' },
  { header: 'Accordion 2', content: 'Content 2' },
  { header: 'Accordion 3', content: 'Content 3' },
];

onMounted(() => {
  const element = plumageAccordionContainerEl.value;
  if (!element) return;

  element.data = items;
  element.parentId = 'vue-plumage-accordion-container';
  element.singleOpen = true;
  element.variant = 'primary';
  element.size = 'sm';
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

type PlumageAccordionContainerItem = {
  header: string;
  content: string;
};

type PlumageAccordionContainerElement = HTMLElement & {
  data?: PlumageAccordionContainerItem[];
  parentId?: string;
  singleOpen?: boolean;
  variant?: string;
  size?: string;
};

@Component({
  selector: 'app-plumage-accordion-container',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <plumage-accordion-container
      #plumageAccordionContainerEl
      [attr.aria-label]="ariaLabel"
    ></plumage-accordion-container>
  \`,
})
export class PlumageAccordionContainerComponent
  implements AfterViewInit
{
  @ViewChild('plumageAccordionContainerEl', { static: true })
  private plumageAccordionContainerRef!: ElementRef<PlumageAccordionContainerElement>;

  @Input() ariaLabel = 'Account settings sections';
  @Input() parentId = 'angular-plumage-accordion-container';
  @Input() singleOpen = true;
  @Input() variant = 'primary';
  @Input() size = 'sm';

  @Input() data: PlumageAccordionContainerItem[] = [
    { header: 'Accordion 1', content: 'Content 1' },
    { header: 'Accordion 2', content: 'Content 2' },
    { header: 'Accordion 3', content: 'Content 3' },
  ];

  ngAfterViewInit(): void {
    const element =
      this.plumageAccordionContainerRef.nativeElement;

    element.data = this.data;
    element.parentId = this.parentId;
    element.singleOpen = this.singleOpen;
    element.variant = this.variant;
    element.size = this.size;
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let plumageAccordionContainerEl = null;

  const items = [
    { header: 'Accordion 1', content: 'Content 1' },
    { header: 'Accordion 2', content: 'Content 2' },
    { header: 'Accordion 3', content: 'Content 3' },
  ];

  onMount(() => {
    const element = plumageAccordionContainerEl;
    if (!element) return;

    element.data = items;
    element.parentId = 'svelte-plumage-accordion-container';
    element.singleOpen = true;
    element.variant = 'primary';
    element.size = 'sm';
  });
</script>

<main>
  <plumage-accordion-container
    bind:this={plumageAccordionContainerEl}
    aria-label="Account settings sections"
  />
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let plumageAccordionContainerEl = null;

  const items = [
    { header: 'Accordion 1', content: 'Content 1' },
    { header: 'Accordion 2', content: 'Content 2' },
    { header: 'Accordion 3', content: 'Content 3' },
  ];

  onMount(() => {
    if (!browser) return;

    const element = plumageAccordionContainerEl;
    if (!element) return;

    element.data = items;
    element.parentId = 'sveltekit-plumage-accordion-container';
    element.singleOpen = true;
    element.variant = 'primary';
    element.size = 'sm';
  });
</script>

{#if browser}
  <main>
    <plumage-accordion-container
      bind:this={plumageAccordionContainerEl}
      aria-label="Account settings sections"
    />
  </main>
{/if}
`.trim();
