// ============================================================================
// File: src/stories/plumage-datepicker-component.examples.js
// ============================================================================

export const htmlExample = `<plumage-datepicker-component
  label="Date Picker"
  date-format="YYYY-MM-DD"
  append
  input-id="example-plumage-datepicker"
></plumage-datepicker-component>`;

export const reactExample = `import { useEffect, useRef } from 'react';
import { defineCustomElements } from 'stencil-component-library/loader';

defineCustomElements();

export default function PlumageDatepicker() {
  const datepickerRef = useRef(null);

  useEffect(() => {
    const element = datepickerRef.current;

    const onDateSelected = (event) => {
      console.log('date-selected', event.detail);
    };

    element?.addEventListener('date-selected', onDateSelected);

    return () => {
      element?.removeEventListener('date-selected', onDateSelected);
    };
  }, []);

  return (
    <plumage-datepicker-component
      ref={datepickerRef}
      label="Date Picker"
      date-format="YYYY-MM-DD"
      append
      input-id="react-plumage-datepicker"
    ></plumage-datepicker-component>
  );
}`;

export const vueExample = `<template>
  <plumage-datepicker-component
    label="Date Picker"
    date-format="YYYY-MM-DD"
    append
    input-id="vue-plumage-datepicker"
    @date-selected="handleDateSelected"
  />
</template>

<script setup>
const handleDateSelected = (event) => {
  console.log('date-selected', event.detail);
};
</script>`;

export const angularExample = `import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

@Component({
  selector: 'app-plumage-datepicker-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <plumage-datepicker-component
      label="Date Picker"
      date-format="YYYY-MM-DD"
      append
      input-id="angular-plumage-datepicker"
      (date-selected)="handleDateSelected($event)">
    </plumage-datepicker-component>
  \`,
})
export class PlumageDatepickerComponent {
  handleDateSelected(
    event: CustomEvent<{
      value: string;
      formattedDate: string;
      date: string;
    }>,
  ) {
    console.log('date-selected', event.detail);
  }
}`;

export const svelteExample = `<script>
  import { onMount } from 'svelte';

  let datepickerEl = null;

  onMount(() => {
    const onDateSelected = (event) => {
      console.log('date-selected', event.detail);
    };

    datepickerEl?.addEventListener(
      'date-selected',
      onDateSelected
    );

    return () => {
      datepickerEl?.removeEventListener(
        'date-selected',
        onDateSelected
      );
    };
  });
</script>

<plumage-datepicker-component
  bind:this={datepickerEl}
  label="Date Picker"
  date-format="YYYY-MM-DD"
  append
  input-id="svelte-plumage-datepicker"
></plumage-datepicker-component>`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let datepickerEl = null;

  onMount(() => {
    if (!browser) return;

    const onDateSelected = (event) => {
      console.log('date-selected', event.detail);
    };

    datepickerEl?.addEventListener(
      'date-selected',
      onDateSelected
    );

    return () => {
      datepickerEl?.removeEventListener(
        'date-selected',
        onDateSelected
      );
    };
  });
</script>

{#if browser}
  <plumage-datepicker-component
    bind:this={datepickerEl}
    label="Date Picker"
    date-format="YYYY-MM-DD"
    append
    input-id="sveltekit-plumage-datepicker"
  ></plumage-datepicker-component>
{/if}`;
