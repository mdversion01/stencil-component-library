// stories/plumage/plumage-accordion/plumage-accordion.examples.js
export const reactExample = `
import { useEffect, useRef } from 'react'

export default function PlumageAccordionComponent() {
  const plumageAccordionRef = useRef(null)

  useEffect(() => {
    const plumageAccordionEl = plumageAccordionRef.current
    if (!plumageAccordionEl) return

    plumageAccordionEl.accordion = true
    plumageAccordionEl.targetId = 'react-plumage-accordion'
    plumageAccordionEl.isOpen = false

    const onPlumageAccordionToggle = (event) => {
      console.log('toggleEvent fired:', event.detail)
    }

    plumageAccordionEl.addEventListener(
      'toggleEvent',
      onPlumageAccordionToggle,
    )

    return () => {
      plumageAccordionEl.removeEventListener(
        'toggleEvent',
        onPlumageAccordionToggle,
      )
    }
  }, [])

  return (
    <main>
      <plumage-accordion-component ref={plumageAccordionRef}>
        <span slot="accordion-header">Accordion header</span>
        <div slot="content">
          Accordion content
        </div>
      </plumage-accordion-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <plumage-accordion-component ref="plumageAccordionEl">
    <span slot="accordion-header">Accordion header</span>
    <div slot="content">Accordion content</div>
  </plumage-accordion-component>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';

const plumageAccordionEl = ref(null);
const open = ref(false);

const onPlumageAccordionToggle = (event) => {
  open.value = Boolean(event.detail);
};

onMounted(() => {
  const element = plumageAccordionEl.value;
  if (!element) return;

  element.accordion = true;
  element.targetId = 'vue-plumage-accordion';
  element.isOpen = open.value;

  element.addEventListener(
    'toggleEvent',
    onPlumageAccordionToggle,
  );
});

onBeforeUnmount(() => {
  plumageAccordionEl.value?.removeEventListener(
    'toggleEvent',
    onPlumageAccordionToggle,
  );
});

watch(open, (value) => {
  if (plumageAccordionEl.value) {
    plumageAccordionEl.value.isOpen = value;
  }
});
</script>
`.trim();

export const angularExample = `import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

type PlumageAccordionElement = HTMLElement & {
  accordion?: boolean;
  targetId?: string;
  isOpen?: boolean;
};

@Component({
  selector: 'app-plumage-accordion-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <plumage-accordion-component #plumageAccordionEl>
      <span slot="accordion-header">{{ header }}</span>
      <div slot="content">{{ content }}</div>
    </plumage-accordion-component>
  \`,
})
export class PlumageAccordionComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('plumageAccordionEl', { static: true })
  private plumageAccordionRef!: ElementRef<PlumageAccordionElement>;

  @Input() header = 'Accordion header';
  @Input() content = 'Accordion content';
  @Input() targetId = 'angular-plumage-accordion';
  @Input() accordion = true;
  @Input() open = false;

  private handlePlumageAccordionToggle = (event: Event): void => {
    const customEvent = event as CustomEvent<boolean>;
    this.open = Boolean(customEvent.detail);
  };

  ngAfterViewInit(): void {
    const plumageAccordionEl = this.plumageAccordionRef.nativeElement;

    plumageAccordionEl.accordion = this.accordion;
    plumageAccordionEl.targetId = this.targetId;
    plumageAccordionEl.isOpen = this.open;

    plumageAccordionEl.addEventListener(
      'toggleEvent',
      this.handlePlumageAccordionToggle as EventListener,
    );
  }

  ngOnDestroy(): void {
    this.plumageAccordionRef.nativeElement.removeEventListener(
      'toggleEvent',
      this.handlePlumageAccordionToggle as EventListener,
    );
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let plumageAccordionEl = null;
  let open = false;

  function onPlumageAccordionToggle(event) {
    open = Boolean(event.detail);
  }

  onMount(() => {
    const element = plumageAccordionEl;
    if (!element) return;

    element.accordion = true;
    element.targetId = 'svelte-plumage-accordion';
    element.isOpen = open;

    element.addEventListener(
      'toggleEvent',
      onPlumageAccordionToggle,
    );

    return () => {
      element.removeEventListener(
        'toggleEvent',
        onPlumageAccordionToggle,
      );
    };
  });

  $effect(() => {
    if (plumageAccordionEl) {
      plumageAccordionEl.isOpen = open;
    }
  });
</script>

<main>
  <plumage-accordion-component bind:this={plumageAccordionEl}>
    <span slot="accordion-header">Accordion header</span>
    <div slot="content">
      Accordion content
    </div>
  </plumage-accordion-component>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let plumageAccordionEl = null;
  let open = false;

  function onPlumageAccordionToggle(event) {
    open = Boolean(event.detail);
  }

  onMount(() => {
    if (!browser) return;

    const element = plumageAccordionEl;
    if (!element) return;

    element.accordion = true;
    element.targetId = 'sveltekit-plumage-accordion';
    element.isOpen = open;

    element.addEventListener(
      'toggleEvent',
      onPlumageAccordionToggle,
    );

    return () => {
      element.removeEventListener(
        'toggleEvent',
        onPlumageAccordionToggle,
      );
    };
  });

  $effect(() => {
    if (browser && plumageAccordionEl) {
      plumageAccordionEl.isOpen = open;
    }
  });
</script>

{#if browser}
  <main>
    <plumage-accordion-component bind:this={plumageAccordionEl}>
      <span slot="accordion-header">Accordion header</span>
      <div slot="content">
        Accordion content
      </div>
    </plumage-accordion-component>
  </main>
{/if}
`.trim();
