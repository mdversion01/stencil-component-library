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

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-datepicker-example',
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
export class DatepickerExampleComponent {
  handleDateSelected(event: CustomEvent<{ formattedDate: string }>) {
    console.log('date-selected', event.detail);
  }
}`;
