export const htmlExample = `<datepicker-component
  label="Date Picker"
  date-format="YYYY-MM-DD"
  placeholder="YYYY-MM-DD"
  append
  input-id="example-datepicker"
></datepicker-component>`;

export const reactExample = `import { useEffect } from 'react';
import { defineCustomElements } from 'stencil-component-library/loader';

defineCustomElements();

export default function Datepicker() {
  useEffect(() => {
    const el = document.querySelector('datepicker-component');
    const onDateSelected = (event) => {
      console.log('date-selected', event.detail);
    };

    el?.addEventListener('date-selected', onDateSelected);
    return () => el?.removeEventListener('date-selected', onDateSelected);
  }, []);

  return (
    <datepicker-component
      label="Date Picker"
      date-format="YYYY-MM-DD"
      placeholder="YYYY-MM-DD"
      append
      input-id="react-datepicker"
    ></datepicker-component>
  );
}`;

export const vueExample = `<template>
  <datepicker-component
    label="Date Picker"
    date-format="YYYY-MM-DD"
    placeholder="YYYY-MM-DD"
    append
    input-id="vue-datepicker"
    @date-selected="handleDateSelected"
  />
</template>

<script setup>
const handleDateSelected = (event) => {
  console.log('date-selected', event.detail);
};
</script>`;

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-datepicker-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <datepicker-component
      label="Date Picker"
      date-format="YYYY-MM-DD"
      placeholder="YYYY-MM-DD"
      append
      input-id="angular-datepicker"
      (date-selected)="handleDateSelected($event)">
    </datepicker-component>
  \`,
})
export class DatepickerComponent {
  handleDateSelected(event: CustomEvent<{ formattedDate: string }>) {
    console.log('date-selected', event.detail);
  }
}
`;

export const svelteExample = `<script>
  import { onMount } from 'svelte';

  let datepickerEl = null;

  onMount(() => {
    const onDateSelected = (event) => {
      console.log('date-selected', event.detail);
    };

    datepickerEl?.addEventListener('date-selected', onDateSelected);

    return () => {
      datepickerEl?.removeEventListener('date-selected', onDateSelected);
    };
  });
</script>

<datepicker-component
  bind:this={datepickerEl}
  label="Date Picker"
  date-format="YYYY-MM-DD"
  placeholder="YYYY-MM-DD"
  append
  input-id="svelte-datepicker"
></datepicker-component>`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let datepickerEl = null;

  onMount(() => {
    if (!browser) return;

    const onDateSelected = (event) => {
      console.log('date-selected', event.detail);
    };

    datepickerEl?.addEventListener('date-selected', onDateSelected);

    return () => {
      datepickerEl?.removeEventListener('date-selected', onDateSelected);
    };
  });
</script>

{#if browser}
  <datepicker-component
    bind:this={datepickerEl}
    label="Date Picker"
    date-format="YYYY-MM-DD"
    placeholder="YYYY-MM-DD"
    append
    input-id="sveltekit-datepicker"
  ></datepicker-component>
{/if}`;
