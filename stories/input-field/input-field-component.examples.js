// File: src/stories/input-field-component/input-field-component.examples.js

export const reactExample = `
export default function InputFieldComponent() {
  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <input-field-component
        label="First Name"
        input-id="first-name"
        placeholder="Enter your first name"
      ></input-field-component>

      <form-component form-id="demo-form" form-layout="horizontal">
        <input-field-component
          slot="formField"
          label="Email"
          input-id="email"
          type="email"
          form-layout="horizontal"
          label-col={3}
          input-col={9}
        ></input-field-component>
      </form-component>

      <input-field-component
        label="Username"
        input-id="username"
        required
        validation
        validation-message="Please enter at least 3 characters."
      ></input-field-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <input-field-component
      label="First Name"
      input-id="first-name"
      placeholder="Enter your first name"
    ></input-field-component>

    <form-component form-id="demo-form" form-layout="horizontal">
      <input-field-component
        slot="formField"
        label="Email"
        input-id="email"
        type="email"
        form-layout="horizontal"
        :label-col="3"
        :input-col="9"
      ></input-field-component>
    </form-component>

    <input-field-component
      label="Username"
      input-id="username"
      required
      validation
      validation-message="Please enter at least 3 characters."
    ></input-field-component>
  </main>
</template>
`.trim();

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-input-field',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <input-field-component
        label="First Name"
        input-id="first-name"
        placeholder="Enter your first name"
      ></input-field-component>

      <form-component form-id="demo-form" form-layout="horizontal">
        <input-field-component
          slot="formField"
          label="Email"
          input-id="email"
          type="email"
          form-layout="horizontal"
          label-col="3"
          input-col="9"
        ></input-field-component>
      </form-component>

      <input-field-component
        label="Username"
        input-id="username"
        required
        validation
        validation-message="Please enter at least 3 characters."
      ></input-field-component>
    </main>
  \`,
})
export class InputFieldComponent {}
`.trim();

export const svelteExample = `
<main style="display:grid; gap:16px;">
  <input-field-component
    label="First Name"
    input-id="first-name"
    placeholder="Enter your first name"
  ></input-field-component>

  <form-component form-id="demo-form" form-layout="horizontal">
    <input-field-component
      slot="formField"
      label="Email"
      input-id="email"
      type="email"
      form-layout="horizontal"
      label-col="3"
      input-col="9"
    ></input-field-component>
  </form-component>

  <input-field-component
    label="Username"
    input-id="username"
    required
    validation
    validation-message="Please enter at least 3 characters."
  ></input-field-component>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
</script>

{#if browser}
  <main style="display:grid; gap:16px;">
    <input-field-component
      label="First Name"
      input-id="first-name"
      placeholder="Enter your first name"
    ></input-field-component>

    <form-component form-id="demo-form" form-layout="horizontal">
      <input-field-component
        slot="formField"
        label="Email"
        input-id="email"
        type="email"
        form-layout="horizontal"
        label-col="3"
        input-col="9"
      ></input-field-component>
    </form-component>

    <input-field-component
      label="Username"
      input-id="username"
      required
      validation
      validation-message="Please enter at least 3 characters."
    ></input-field-component>
  </main>
{/if}
`.trim();
