// File: src/stories/input-group-component/input-group-component.examples.js

export const reactExample = `
export default function InputGroupComponent() {
  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <input-group-component
        append
        label="Amount"
        input-id="amount-play"
        placeholder="Enter amount"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        prepend
        append
        label="Amount"
        input-id="amount-both-icons"
        prepend-icon="fa-solid fa-dollar-sign"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        prepend
        append
        other-content
        label="Search"
        input-id="search-q"
      >
        <button-component slot="prepend" type="button" variant="secondary">
          Go
        </button-component>
        <button-component slot="append" type="button" variant="secondary">
          Go
        </button-component>
      </input-group-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <input-group-component
      append
      label="Amount"
      input-id="amount-play"
      placeholder="Enter amount"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      prepend
      append
      label="Amount"
      input-id="amount-both-icons"
      prepend-icon="fa-solid fa-dollar-sign"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      prepend
      append
      other-content
      label="Search"
      input-id="search-q"
    >
      <button-component slot="prepend" type="button" variant="secondary">
        Go
      </button-component>
      <button-component slot="append" type="button" variant="secondary">
        Go
      </button-component>
    </input-group-component>
  </main>
</template>
`.trim();

export const angularExample = `
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <input-group-component
        append
        label="Amount"
        input-id="amount-play"
        placeholder="Enter amount"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        prepend
        append
        label="Amount"
        input-id="amount-both-icons"
        prepend-icon="fa-solid fa-dollar-sign"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        prepend
        append
        other-content
        label="Search"
        input-id="search-q"
      >
        <button-component slot="prepend" type="button" variant="secondary">
          Go
        </button-component>
        <button-component slot="append" type="button" variant="secondary">
          Go
        </button-component>
      </input-group-component>
    </main>
  \`,
})
export class AppComponent {}
`.trim();
