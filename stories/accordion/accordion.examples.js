export const reactExample = `
import { useEffect, useRef, useState } from 'react';

export default function Example() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.accordion = true;
    el.targetId = 'react-accordion';
    el.isOpen = open;

    const onToggle = (event) => setOpen(Boolean(event.detail));
    el.addEventListener('toggleEvent', onToggle);

    return () => el.removeEventListener('toggleEvent', onToggle);
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.isOpen = open;
  }, [open]);

  return (
    <accordion-component ref={ref}>
      <span slot="accordion-header">Accordion header</span>
      <div slot="content">Accordion content</div>
    </accordion-component>
  );
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

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <accordion-component #accordionEl>
      <span slot="accordion-header">Accordion header</span>
      <div slot="content">Accordion content</div>
    </accordion-component>
  \`,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('accordionEl', { static: true }) accordionRef;

  open = false;

  handleToggle = (event) => {
    this.open = Boolean(event.detail);
  };

  ngAfterViewInit() {
    const el = this.accordionRef.nativeElement;
    el.accordion = true;
    el.targetId = 'angular-accordion';
    el.isOpen = this.open;
    el.addEventListener('toggleEvent', this.handleToggle);
  }

  ngOnDestroy() {
    this.accordionRef.nativeElement.removeEventListener('toggleEvent', this.handleToggle);
  }
}
`.trim();
