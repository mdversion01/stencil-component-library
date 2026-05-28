// File: src/stories/card-component/card-component.examples.js

export const reactExample = `
export default function CardComponent() {
  return (
    <main style={{ display: 'grid', gap: '16px', maxWidth: '22rem' }}>
      <card-component
        card-max-width="22"
        elevation="3"
      >
        <div slot="header">Featured</div>
        <span slot="title">Card title</span>
        <span slot="text">
          This is some quick example text to build on the card title and make up the
          bulk of the card content.
        </span>
        <div slot="footer">
          <p>Card footer</p>
        </div>
      </card-component>

      <card-component
        clickable
        heading-level="3"
        aria-label="Open account details"
      >
        <span slot="title">Clickable card</span>
        <span slot="text">
          This card behaves like a button and emits a customClick event.
        </span>
      </card-component>

      <card-component
        img
        img-src="https://picsum.photos/800/450"
        img-height="11.25rem"
        alt-text="Card image"
        actions
      >
        <span slot="title">Card with image</span>
        <span slot="text">Cards can also include media and actions.</span>
        <span slot="actions">
          <button className="btn btn-primary btn-sm" type="button">Action</button>
        </span>
      </card-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px; max-width:22rem;">
    <card-component
      card-max-width="22"
      elevation="3"
    >
      <div slot="header">Featured</div>
      <span slot="title">Card title</span>
      <span slot="text">
        This is some quick example text to build on the card title and make up the
        bulk of the card content.
      </span>
      <div slot="footer">
        <p>Card footer</p>
      </div>
    </card-component>

    <card-component
      clickable
      heading-level="3"
      aria-label="Open account details"
    >
      <span slot="title">Clickable card</span>
      <span slot="text">
        This card behaves like a button and emits a customClick event.
      </span>
    </card-component>

    <card-component
      img
      img-src="https://picsum.photos/800/450"
      img-height="11.25rem"
      alt-text="Card image"
      actions
    >
      <span slot="title">Card with image</span>
      <span slot="text">Cards can also include media and actions.</span>
      <span slot="actions">
        <button class="btn btn-primary btn-sm" type="button">Action</button>
      </span>
    </card-component>
  </main>
</template>
`.trim();

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-card',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px; max-width:22rem;">
      <card-component
        card-max-width="22"
        elevation="3"
      >
        <div slot="header">Featured</div>
        <span slot="title">Card title</span>
        <span slot="text">
          This is some quick example text to build on the card title and make up the
          bulk of the card content.
        </span>
        <div slot="footer">
          <p>Card footer</p>
        </div>
      </card-component>

      <card-component
        clickable
        heading-level="3"
        aria-label="Open account details"
        no-header
      >
        <span slot="title">Clickable card</span>
        <span slot="text">
          This card behaves like a button and emits a customClick event.
        </span>
      </card-component>

      <card-component
        img
        img-src="https://picsum.photos/800/450"
        img-height="11.25rem"
        alt-text="Card image"
        actions
      >
        <div slot="header">Card Header</div>
        <span slot="title">Card with image</span>
        <span slot="text">Cards can also include media and actions.</span>
        <span slot="actions">
          <button class="btn btn-primary btn-sm" type="button">Action</button>
        </span>
      </card-component>
    </main>
  \`,
})
export class CardComponent {}
`.trim();

export const svelteExample = `
<main style="display:grid; gap:16px; max-width:22rem;">
  <card-component
    card-max-width="22"
    elevation="3"
  >
    <div slot="header">Featured</div>
    <span slot="title">Card title</span>
    <span slot="text">
      This is some quick example text to build on the card title and make up the
      bulk of the card content.
    </span>
    <div slot="footer">
      <p>Card footer</p>
    </div>
  </card-component>

  <card-component
    clickable
    heading-level="3"
    aria-label="Open account details"
  >
    <span slot="title">Clickable card</span>
    <span slot="text">
      This card behaves like a button and emits a customClick event.
    </span>
  </card-component>

  <card-component
    img
    img-src="https://picsum.photos/800/450"
    img-height="11.25rem"
    alt-text="Card image"
    actions
  >
    <span slot="title">Card with image</span>
    <span slot="text">Cards can also include media and actions.</span>
    <span slot="actions">
      <button class="btn btn-primary btn-sm" type="button">Action</button>
    </span>
  </card-component>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
</script>

{#if browser}
  <main style="display:grid; gap:16px; max-width:22rem;">
    <card-component
      card-max-width="22"
      elevation="3"
    >
      <div slot="header">Featured</div>
      <span slot="title">Card title</span>
      <span slot="text">
        This is some quick example text to build on the card title and make up the
        bulk of the card content.
      </span>
      <div slot="footer">
        <p>Card footer</p>
      </div>
    </card-component>

    <card-component
      clickable
      heading-level="3"
      aria-label="Open account details"
    >
      <span slot="title">Clickable card</span>
      <span slot="text">
        This card behaves like a button and emits a customClick event.
      </span>
    </card-component>

    <card-component
      img
      img-src="https://picsum.photos/800/450"
      img-height="11.25rem"
      alt-text="Card image"
      actions
    >
      <span slot="title">Card with image</span>
      <span slot="text">Cards can also include media and actions.</span>
      <span slot="actions">
        <button class="btn btn-primary btn-sm" type="button">Action</button>
      </span>
    </card-component>
  </main>
{/if}
`.trim();
