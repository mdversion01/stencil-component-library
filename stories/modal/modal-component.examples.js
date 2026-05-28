// File: src/stories/modal-component.examples.js

export const reactExample = `
export default function ModalComponent() {
  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <modal-component
        btn-text="Open modal"
        variant="primary"
        modal-title="Modal title"
      >
        <p>Woohoo, you're reading this text in a modal!</p>
        <p>This is the modal body. Add any markup you like here.</p>

        <button-component slot="footer" variant="primary">
          Save changes
        </button-component>
      </modal-component>

      <modal-component
        btn-text="Scrollable body"
        variant="info"
        modal-size="lg"
        scrollable-body
      >
        <p>Line 1</p>
        <p>Line 2</p>
        <p>Line 3</p>
        <p>Line 4</p>
        <p>Line 5</p>
        <p>Line 6</p>
        <p>Line 7</p>
        <p>Line 8</p>
        <p>Line 9</p>
        <p>Line 10</p>
      </modal-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <modal-component
      btn-text="Open modal"
      variant="primary"
      modal-title="Modal title"
    >
      <p>Woohoo, you're reading this text in a modal!</p>
      <p>This is the modal body. Add any markup you like here.</p>

      <button-component slot="footer" variant="primary">
        Save changes
      </button-component>
    </modal-component>

    <modal-component
      btn-text="Scrollable body"
      variant="info"
      modal-size="lg"
      scrollable-body
    >
      <p>Line 1</p>
      <p>Line 2</p>
      <p>Line 3</p>
      <p>Line 4</p>
      <p>Line 5</p>
      <p>Line 6</p>
      <p>Line 7</p>
      <p>Line 8</p>
      <p>Line 9</p>
      <p>Line 10</p>
    </modal-component>
  </main>
</template>
`.trim();

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-modal',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <modal-component
        btn-text="Open modal"
        variant="primary"
        modal-title="Modal title"
      >
        <p>Woohoo, you're reading this text in a modal!</p>
        <p>This is the modal body. Add any markup you like here.</p>

        <button-component slot="footer" variant="primary">
          Save changes
        </button-component>
      </modal-component>

      <modal-component
        btn-text="Scrollable body"
        variant="info"
        modal-size="lg"
        scrollable-body
      >
        <p>Line 1</p>
        <p>Line 2</p>
        <p>Line 3</p>
        <p>Line 4</p>
        <p>Line 5</p>
        <p>Line 6</p>
        <p>Line 7</p>
        <p>Line 8</p>
        <p>Line 9</p>
        <p>Line 10</p>
      </modal-component>
    </main>
  \`,
})
export class ModalComponent {}
`.trim();

export const svelteExample = `
<main style="display:grid; gap:16px;">
  <modal-component
    btn-text="Open modal"
    variant="primary"
    modal-title="Modal title"
  >
    <p>Woohoo, you're reading this text in a modal!</p>
    <p>This is the modal body. Add any markup you like here.</p>

    <button-component slot="footer" variant="primary">
      Save changes
    </button-component>
  </modal-component>

  <modal-component
    btn-text="Scrollable body"
    variant="info"
    modal-size="lg"
    scrollable-body
  >
    <p>Line 1</p>
    <p>Line 2</p>
    <p>Line 3</p>
    <p>Line 4</p>
    <p>Line 5</p>
    <p>Line 6</p>
    <p>Line 7</p>
    <p>Line 8</p>
    <p>Line 9</p>
    <p>Line 10</p>
  </modal-component>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
</script>

{#if browser}
  <main style="display:grid; gap:16px;">
    <modal-component
      btn-text="Open modal"
      variant="primary"
      modal-title="Modal title"
    >
      <p>Woohoo, you're reading this text in a modal!</p>
      <p>This is the modal body. Add any markup you like here.</p>

      <button-component slot="footer" variant="primary">
        Save changes
      </button-component>
    </modal-component>

    <modal-component
      btn-text="Scrollable body"
      variant="info"
      modal-size="lg"
      scrollable-body
    >
      <p>Line 1</p>
      <p>Line 2</p>
      <p>Line 3</p>
      <p>Line 4</p>
      <p>Line 5</p>
      <p>Line 6</p>
      <p>Line 7</p>
      <p>Line 8</p>
      <p>Line 9</p>
      <p>Line 10</p>
    </modal-component>
  </main>
{/if}
`.trim();
