export const reactExample = `
import { useEffect, useRef } from 'react'

export default function AccordionComponent() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.accordion = true
    el.targetId = 'react-accordion'
    el.isOpen = false

    const onToggle = (event) => {
      console.log('toggleEvent fired:', event.detail)
    }

    el.addEventListener('toggleEvent', onToggle)

    return () => {
      el.removeEventListener('toggleEvent', onToggle)
    }
  }, [])

  return (
    <main>
      <accordion-component ref={ref}>
        <span slot="accordion-header">Accordion header</span>
        <div slot="content">
          Accordion content
        </div>
      </accordion-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <accordion-component ref="accordionEl">
    <span slot="accordion-header">Accordion header</span>
    <div slot="content">Accordion content</div>
  </accordion-component>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';

const accordionEl = ref(null);
const open = ref(false);

const onToggle = (event) => {
  open.value = Boolean(event.detail);
};

onMounted(() => {
  const el = accordionEl.value;
  if (!el) return;

  el.accordion = true;
  el.targetId = 'vue-accordion';
  el.isOpen = open.value;
  el.addEventListener('toggleEvent', onToggle);
});

onBeforeUnmount(() => {
  accordionEl.value?.removeEventListener('toggleEvent', onToggle);
});

watch(open, (value) => {
  if (accordionEl.value) accordionEl.value.isOpen = value;
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

type AccordionElement = HTMLElement & {
  accordion?: boolean;
  targetId?: string;
  isOpen?: boolean;
};

@Component({
  selector: 'app-accordion',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <accordion-component #accordionEl>
      <span slot="accordion-header">{{ header }}</span>
      <div slot="content">{{ content }}</div>
    </accordion-component>
  \`,
})

export class AccordionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('accordionEl', { static: true })
  private accordionRef!: ElementRef<AccordionElement>;

  @Input() header = 'Accordion header';
  @Input() content = 'Accordion content';
  @Input() targetId = 'angular-accordion';
  @Input() accordion = true;
  @Input() open = false;

  private handleToggle = (event: Event): void => {
    const customEvent = event as CustomEvent<boolean>;
    this.open = Boolean(customEvent.detail);
  };

  ngAfterViewInit(): void {
    const el = this.accordionRef.nativeElement;
    el.accordion = this.accordion;
    el.targetId = this.targetId;
    el.isOpen = this.open;
    el.addEventListener('toggleEvent', this.handleToggle as EventListener);
  }

  ngOnDestroy(): void {
    this.accordionRef.nativeElement.removeEventListener(
      'toggleEvent',
      this.handleToggle as EventListener,
    );
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let accordionEl = null;
  let open = false;

  function onToggle(event) {
    open = Boolean(event.detail);
  }

  onMount(() => {
    const el = accordionEl;
    if (!el) return;

    el.accordion = true;
    el.targetId = 'svelte-accordion';
    el.isOpen = open;
    el.addEventListener('toggleEvent', onToggle);

    return () => {
      el.removeEventListener('toggleEvent', onToggle);
    };
  });

  $effect(() => {
    if (accordionEl) {
      accordionEl.isOpen = open;
    }
  });
</script>

<main>
  <accordion-component bind:this={accordionEl}>
    <span slot="accordion-header">Accordion header</span>
    <div slot="content">
      Accordion content
    </div>
  </accordion-component>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let accordionEl = null;
  let open = false;

  function onToggle(event) {
    open = Boolean(event.detail);
  }

  onMount(() => {
    if (!browser) return;

    const el = accordionEl;
    if (!el) return;

    el.accordion = true;
    el.targetId = 'sveltekit-accordion';
    el.isOpen = open;
    el.addEventListener('toggleEvent', onToggle);

    return () => {
      el.removeEventListener('toggleEvent', onToggle);
    };
  });

  $effect(() => {
    if (browser && accordionEl) {
      accordionEl.isOpen = open;
    }
  });
</script>

{#if browser}
  <main>
    <accordion-component bind:this={accordionEl}>
      <span slot="accordion-header">Accordion header</span>
      <div slot="content">
        Accordion content
      </div>
    </accordion-component>
  </main>
{/if}
`.trim();
