// File: src/stories/app-wrapper/app-wrapper.examples.js

export const reactExample = `
export default function App() {
  return (
    <main>
      <app-wrapper class-names="p-4 bg-light rounded">
        <h2 className="mb-2">React Example</h2>
        <p className="mb-3">
          This content is passed as children into the Stencil app-wrapper component.
        </p>

        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <button-component btn-text="Primary" variant="primary" size="sm"></button-component>
          <button-component btn-text="Secondary" variant="secondary" size="sm"></button-component>
        </div>
      </app-wrapper>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main>
    <app-wrapper class-names="p-4 bg-light rounded">
      <h2 class="mb-2">Vue Example</h2>
      <p class="mb-3">
        This content is passed into the Stencil app-wrapper component through the default slot.
      </p>

      <div style="display:flex; gap:.5rem; flex-wrap:wrap">
        <button-component btn-text="Primary" variant="primary" size="sm"></button-component>
        <button-component btn-text="Secondary" variant="secondary" size="sm"></button-component>
      </div>
    </app-wrapper>
  </main>
</template>

<script setup>
</script>
`.trim();

export const angularExample = `
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main>
      <app-wrapper class-names="p-4 bg-light rounded">
        <h2 class="mb-2">Angular Example</h2>
        <p class="mb-3">
          This content is projected into the Stencil app-wrapper component.
        </p>

        <div style="display:flex; gap:.5rem; flex-wrap:wrap">
          <button-component btn-text="Primary" variant="primary" size="sm"></button-component>
          <button-component btn-text="Secondary" variant="secondary" size="sm"></button-component>
        </div>
      </app-wrapper>
    </main>
  \`,
})
export class AppComponent {}
`.trim();

export const svelteExample = `
<script lang="ts">
</script>

<main>
  <app-wrapper class-names="p-4 bg-light rounded">
    <h2 class="mb-2">Svelte Example</h2>
    <p class="mb-3">
      This content is passed into the Stencil app-wrapper component through the default slot.
    </p>

    <div style="display:flex; gap:.5rem; flex-wrap:wrap">
      <button-component btn-text="Primary" variant="primary" size="sm"></button-component>
      <button-component btn-text="Secondary" variant="secondary" size="sm"></button-component>
    </div>
  </app-wrapper>
</main>
`.trim();

export const svelteKitExample = `
<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  onMount(async () => {
    if (!browser) return;

    // Only needed if your Stencil components are not already registered globally.
    // const { defineCustomElements } = await import('stencil-component-library/loader');
    // defineCustomElements();
  });
</script>

<main>
  <app-wrapper class-names="p-4 bg-light rounded">
    <h2 class="mb-2">SvelteKit Example</h2>
    <p class="mb-3">
      This content is rendered inside the Stencil app-wrapper component from a SvelteKit page.
    </p>

    <div style="display:flex; gap:.5rem; flex-wrap:wrap">
      <button-component btn-text="Primary" variant="primary" size="sm"></button-component>
      <button-component btn-text="Secondary" variant="secondary" size="sm"></button-component>
    </div>
  </app-wrapper>
</main>
`.trim();
