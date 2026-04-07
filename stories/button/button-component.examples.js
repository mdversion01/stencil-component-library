// File: src/stories/button-component/button-component.examples.js

export const reactExample = `
export default function ButtonComponent() {
  return (
    <main style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <button-component
        variant="primary"
        btn-text="Primary Button"
      ></button-component>

      <button-component
        outlined
        variant="success"
        btn-text="Outlined Success"
      ></button-component>

      <button-component
        slot-side="left"
        variant="secondary"
        btn-text="With Left Icon"
      >
        <span>
          <i className="fa-solid fa-house"></i>
        </span>
      </button-component>

      <button-component
        btn-icon
        aria-label="Favorite"
        title-attr="Favorite"
      >
        <span>
          <i className="fa-solid fa-star"></i>
        </span>
      </button-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:flex; gap:12px; flex-wrap:wrap;">
    <button-component
      variant="primary"
      btn-text="Primary Button"
    ></button-component>

    <button-component
      outlined
      variant="success"
      btn-text="Outlined Success"
    ></button-component>

    <button-component
      slot-side="left"
      variant="secondary"
      btn-text="With Left Icon"
    >
      <span>
        <i class="fa-solid fa-house"></i>
      </span>
    </button-component>

    <button-component
      btn-icon
      aria-label="Favorite"
      title-attr="Favorite"
    >
      <span>
        <i class="fa-solid fa-star"></i>
      </span>
    </button-component>
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
    <main style="display:flex; gap:12px; flex-wrap:wrap;">
      <button-component
        variant="primary"
        btn-text="Primary Button"
      ></button-component>

      <button-component
        outlined
        variant="success"
        btn-text="Outlined Success"
      ></button-component>

      <button-component
        slot-side="left"
        variant="secondary"
        btn-text="With Left Icon"
      >
        <span>
          <i class="fa-solid fa-house"></i>
        </span>
      </button-component>

      <button-component
        btn-icon
        aria-label="Favorite"
        title-attr="Favorite"
      >
        <span>
          <i class="fa-solid fa-star"></i>
        </span>
      </button-component>
    </main>
  \`,
})
export class AppComponent {}
`.trim();
