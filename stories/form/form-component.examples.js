// File: src/stories/form-component/form-component.examples.js

export const reactExample = `
export default function FormComponent() {
  return (
    <form-component
      form-id="profile-form"
      fieldset
      legend
      legend-txt="Profile Details"
      legend-position="left"
      legend-size="base"
      bstyle="solid"
      bwidth={1}
      bradius={8}
      bcolor="#1b2af5 !important"
      styles="padding: 12px;"
    >
      <input-field-component
        slot="formField"
        label="First Name"
        input-id="first-name"
        value=""
      ></input-field-component>

      <input-field-component
        slot="formField"
        label="Last Name"
        input-id="last-name"
        value=""
      ></input-field-component>

      <input-field-component
        slot="formField"
        label="Email"
        input-id="email"
        value=""
      ></input-field-component>

      <button-component
        slot="formField"
        variant="primary"
        style={{ display: 'inline-block', marginLeft: '15px', marginTop: '15px', marginBottom: '15px' }}
      >
        Submit
      </button-component>
    </form-component>
  )
}
`.trim();

export const vueExample = `
<template>
  <form-component
    form-id="profile-form"
    fieldset
    legend
    legend-txt="Profile Details"
    legend-position="left"
    legend-size="base"
    bstyle="solid"
    :bwidth="1"
    :bradius="8"
    bcolor="#1b2af5 !important"
    styles="padding: 12px;"
  >
    <input-field-component
      slot="formField"
      label="First Name"
      input-id="first-name"
      value=""
    ></input-field-component>

    <input-field-component
      slot="formField"
      label="Last Name"
      input-id="last-name"
      value=""
    ></input-field-component>

    <input-field-component
      slot="formField"
      label="Email"
      input-id="email"
      value=""
    ></input-field-component>

    <button-component
      slot="formField"
      variant="primary"
      style="display:inline-block; margin-left:15px; margin-top:15px; margin-bottom:15px;"
    >
      Submit
    </button-component>
  </form-component>
</template>
`.trim();

export const angularExample = `
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <form-component
      form-id="profile-form"
      fieldset
      legend
      legend-txt="Profile Details"
      legend-position="left"
      legend-size="base"
      bstyle="solid"
      bwidth="1"
      bradius="8"
      bcolor="#1b2af5 !important"
      styles="padding: 12px;"
    >
      <input-field-component
        slot="formField"
        label="First Name"
        input-id="first-name"
        value=""
      ></input-field-component>

      <input-field-component
        slot="formField"
        label="Last Name"
        input-id="last-name"
        value=""
      ></input-field-component>

      <input-field-component
        slot="formField"
        label="Email"
        input-id="email"
        value=""
      ></input-field-component>

      <button-component
        slot="formField"
        variant="primary"
        style="display:inline-block; margin-left:15px; margin-top:15px; margin-bottom:15px;"
      >
        Submit
      </button-component>
    </form-component>
  \`,
})
export class AppComponent {}
`.trim();
