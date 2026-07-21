export const reactExample = `
import { useEffect, useRef } from 'react';

const fruitOptions = [
  { value: 'apple', name: 'Apple' },
  { value: 'banana', name: 'Banana' },
  { value: 'cherry', name: 'Cherry' },
];

export default function SelectFieldExample() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.options = fruitOptions;
    el.value = 'banana';
  }, []);

  return (
    <select-field-component
      ref={ref}
      label="Fruits"
      select-field-id="fruit"
      default-option-txt="Select a fruit"
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <select-field-component
    ref="selectEl"
    label="Fruits"
    select-field-id="fruit"
    default-option-txt="Select a fruit"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';

const selectEl = ref(null);

const fruitOptions = [
  { value: 'apple', name: 'Apple' },
  { value: 'banana', name: 'Banana' },
  { value: 'cherry', name: 'Cherry' },
];

onMounted(() => {
  const el = selectEl.value;
  if (!el) return;

  el.options = fruitOptions;
  el.value = 'banana';
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-select-field',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <select-field-component
      #selectEl
      label="Fruits"
      select-field-id="fruit"
      default-option-txt="Select a fruit"
    ></select-field-component>
  \`,
})
export class SelectFieldExampleComponent implements AfterViewInit {
  @ViewChild('selectEl', { static: true }) selectEl!: ElementRef<HTMLElement & { options: Array<{ value: string; name: string }>; value: string }>;

  private readonly fruitOptions = [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ];

  ngAfterViewInit(): void {
    const el = this.selectEl.nativeElement;
    el.options = this.fruitOptions;
    el.value = 'banana';
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let selectEl;

  const fruitOptions = [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ];

  onMount(() => {
    if (!selectEl) return;

    selectEl.options = fruitOptions;
    selectEl.value = 'banana';
  });
</script>

<section>
  <h2>Select Field Example</h2>

  <select-field-component
    bind:this={selectEl}
    label="Fruits"
    select-field-id="fruit"
    default-option-txt="Select a fruit"
  ></select-field-component>
</section>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let selectEl;

  const fruitOptions = [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ];

  onMount(() => {
    if (!browser || !selectEl) return;

    selectEl.options = fruitOptions;
    selectEl.value = 'banana';
  });
</script>

<section>
  <h2>Select Field Example</h2>

  {#if browser}
    <select-field-component
      bind:this={selectEl}
      label="Fruits"
      select-field-id="fruit"
      default-option-txt="Select a fruit"
    ></select-field-component>
  {/if}
</section>
`.trim();
