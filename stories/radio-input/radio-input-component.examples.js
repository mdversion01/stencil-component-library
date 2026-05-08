// src/stories/radio-input-component.examples.js

export const reactExample = `import React from 'react';

const groupOptions = [
  { inputId: 'contact-email', value: 'email', labelTxt: 'Email', checked: true },
  { inputId: 'contact-sms', value: 'sms', labelTxt: 'SMS' },
  { inputId: 'contact-call', value: 'call', labelTxt: 'Phone Call' },
];

export default function RadioInputExample() {
  return (
    <radio-input-component
      bs-radio-group
      name="preferredContact"
      group-title="Preferred Contact"
      group-options={JSON.stringify(groupOptions)}
      onGroupChange={(event) => console.log('Selected value:', event.detail)}
    />
  );
}
`;

export const vueExample = `<template>
  <radio-input-component
    bs-radio-group
    name="preferredContact"
    group-title="Preferred Contact"
    :group-options="serializedOptions"
    @groupChange="handleGroupChange"
  />
</template>

<script setup>
const groupOptions = [
  { inputId: 'contact-email', value: 'email', labelTxt: 'Email', checked: true },
  { inputId: 'contact-sms', value: 'sms', labelTxt: 'SMS' },
  { inputId: 'contact-call', value: 'call', labelTxt: 'Phone Call' },
];

const serializedOptions = JSON.stringify(groupOptions);

const handleGroupChange = (event) => {
  console.log('Selected value:', event.detail);
};
</script>
`;

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-radio-input-example',
  template: \`
    <radio-input-component
      bs-radio-group
      name="preferredContact"
      group-title="Preferred Contact"
      [attr.group-options]="serializedOptions"
      (groupChange)="handleGroupChange($event)"
    ></radio-input-component>
  \`,
})
export class RadioInputExampleComponent {
  groupOptions = [
    { inputId: 'contact-email', value: 'email', labelTxt: 'Email', checked: true },
    { inputId: 'contact-sms', value: 'sms', labelTxt: 'SMS' },
    { inputId: 'contact-call', value: 'call', labelTxt: 'Phone Call' },
  ];

  serializedOptions = JSON.stringify(this.groupOptions);

  handleGroupChange(event: CustomEvent<string>) {
    console.log('Selected value:', event.detail);
  }
}
`;
