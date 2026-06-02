// File: src/stories/input-group-component/input-group-component.examples.js

export const reactExample = `
export default function InputGroupComponent() {
  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <input-group-component
        has-append
        label="Amount"
        input-id="amount-play"
        placeholder="Enter amount"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        has-prepend
        has-append
        label="Amount"
        input-id="amount-both-icons"
        prepend-icon="fa-solid fa-dollar-sign"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        has-append
        label="Search"
        input-id="search-q"
        append-button
        append-text="Go"
        append-button-variant="secondary"
        append-button-id="search-q-append-btn"
      ></input-group-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <input-group-component
      has-append
      label="Amount"
      input-id="amount-play"
      placeholder="Enter amount"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      has-prepend
      has-append
      label="Amount"
      input-id="amount-both-icons"
      prepend-icon="fa-solid fa-dollar-sign"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      has-append
      label="Search"
      input-id="search-q"
      append-button
      append-text="Go"
      append-button-variant="secondary"
      append-button-id="search-q-append-btn"
    ></input-group-component>
  </main>
</template>
`.trim();

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-input-group',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <input-group-component
        has-append
        label="Amount"
        input-id="amount-play"
        placeholder="Enter amount"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        has-prepend
        has-append
        label="Amount"
        input-id="amount-both-icons"
        prepend-icon="fa-solid fa-dollar-sign"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        has-append
        label="Search"
        input-id="search-q"
        append-button
        append-text="Go"
        append-button-variant="secondary"
        append-button-id="search-q-append-btn"
      ></input-group-component>
    </main>
  \`,
})
export class InputGroupComponent {}
`.trim();

export const svelteExample = `
<main style="display:grid; gap:16px;">
  <input-group-component
    has-append
    label="Amount"
    input-id="amount-play"
    placeholder="Enter amount"
    append-icon="fa-solid fa-dollar-sign"
  ></input-group-component>

  <input-group-component
    has-prepend
    has-append
    label="Amount"
    input-id="amount-both-icons"
    prepend-icon="fa-solid fa-dollar-sign"
    append-icon="fa-solid fa-dollar-sign"
  ></input-group-component>

  <input-group-component
    has-append
    label="Search"
    input-id="search-q"
    append-button
    append-text="Go"
    append-button-variant="secondary"
    append-button-id="search-q-append-btn"
  ></input-group-component>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
</script>

{#if browser}
  <main style="display:grid; gap:16px;">
    <input-group-component
      has-append
      label="Amount"
      input-id="amount-play"
      placeholder="Enter amount"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      has-prepend
      has-append
      label="Amount"
      input-id="amount-both-icons"
      prepend-icon="fa-solid fa-dollar-sign"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      has-append
      label="Search"
      input-id="search-q"
      append-button
      append-text="Go"
      append-button-variant="secondary"
      append-button-id="search-q-append-btn"
    ></input-group-component>
  </main>
{/if}
`.trim();
