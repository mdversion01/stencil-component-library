export const reactExample = `import React from 'react';

const fruitOptions = [
  { value: 'apple', name: 'Apple' },
  { value: 'banana', name: 'Banana' },
  { value: 'cherry', name: 'Cherry' },
];

export default function SelectFieldExample() {
  return (
    <select-field-component
      label="Fruits"
      select-field-id="fruit"
      default-option-txt="Select a fruit"
      options={JSON.stringify(fruitOptions)}
      value="banana"
    />
  );
}
`;

export const vueExample = `<template>
  <select-field-component
    label="Fruits"
    select-field-id="fruit"
    default-option-txt="Select a fruit"
    :options="serializedOptions"
    value="banana"
  />
</template>

<script setup>
const fruitOptions = [
  { value: 'apple', name: 'Apple' },
  { value: 'banana', name: 'Banana' },
  { value: 'cherry', name: 'Cherry' },
];

const serializedOptions = JSON.stringify(fruitOptions);
</script>
`;

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-select-field',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <select-field-component
      label="Fruits"
      select-field-id="fruit"
      default-option-txt="Select a fruit"
      [attr.options]="serializedOptions"
      value="banana"
    ></select-field-component>
  \`,
})
export class SelectFieldComponent {
  fruitOptions = [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ];

  serializedOptions = JSON.stringify(this.fruitOptions);
}
`;

export const svelteExample = `<script>
  const fruitOptions = [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ];

  const serializedOptions = JSON.stringify(fruitOptions);
</script>

<section>
  <h2>Select Field Example</h2>

  <select-field-component
    label="Fruits"
    select-field-id="fruit"
    default-option-txt="Select a fruit"
    options={serializedOptions}
    value="banana"
  ></select-field-component>
</section>
`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';

  const fruitOptions = [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ];

  const serializedOptions = JSON.stringify(fruitOptions);
</script>

<section>
  <h2>Select Field Example</h2>

  {#if browser}
    <select-field-component
      label="Fruits"
      select-field-id="fruit"
      default-option-txt="Select a fruit"
      options={serializedOptions}
      value="banana"
    ></select-field-component>
  {/if}
</section>
`;
