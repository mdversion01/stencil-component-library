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

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-select-field-example',
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
export class SelectFieldExampleComponent {
  fruitOptions = [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ];

  serializedOptions = JSON.stringify(this.fruitOptions);
}
`;
