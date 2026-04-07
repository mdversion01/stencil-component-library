// File: src/stories/button-group/button-group.examples.js

export const reactExample = `
export default function ButtonGroupComponent() {
  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <button-group aria-label="Actions">
        <button-component
          group-btn
          start
          variant="primary"
          size="sm"
          btn-text="Save"
        ></button-component>

        <button-component
          group-btn
          variant="primary"
          size="sm"
          btn-text="Edit"
        ></button-component>

        <button-component
          group-btn
          end
          variant="primary"
          size="sm"
          btn-text="Delete"
        ></button-component>
      </button-group>

      <button-group vertical aria-label="Vertical actions">
        <button-component
          group-btn
          start
          vertical
          variant="secondary"
          size="sm"
          btn-text="Top"
        ></button-component>

        <button-component
          group-btn
          vertical
          variant="secondary"
          size="sm"
          btn-text="Middle"
        ></button-component>

        <button-component
          group-btn
          end
          vertical
          variant="secondary"
          size="sm"
          btn-text="Bottom"
        ></button-component>
      </button-group>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <button-group aria-label="Actions">
      <button-component
        group-btn
        start
        variant="primary"
        size="sm"
        btn-text="Save"
      ></button-component>

      <button-component
        group-btn
        variant="primary"
        size="sm"
        btn-text="Edit"
      ></button-component>

      <button-component
        group-btn
        end
        variant="primary"
        size="sm"
        btn-text="Delete"
      ></button-component>
    </button-group>

    <button-group vertical aria-label="Vertical actions">
      <button-component
        group-btn
        start
        vertical
        variant="secondary"
        size="sm"
        btn-text="Top"
      ></button-component>

      <button-component
        group-btn
        vertical
        variant="secondary"
        size="sm"
        btn-text="Middle"
      ></button-component>

      <button-component
        group-btn
        end
        vertical
        variant="secondary"
        size="sm"
        btn-text="Bottom"
      ></button-component>
    </button-group>
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
      <button-group aria-label="Actions">
        <button-component
          group-btn
          start
          variant="primary"
          size="sm"
          btn-text="Save"
        ></button-component>

        <button-component
          group-btn
          variant="primary"
          size="sm"
          btn-text="Edit"
        ></button-component>

        <button-component
          group-btn
          end
          variant="primary"
          size="sm"
          btn-text="Delete"
        ></button-component>
      </button-group>

      <button-group vertical aria-label="Vertical actions">
        <button-component
          group-btn
          start
          vertical
          variant="secondary"
          size="sm"
          btn-text="Top"
        ></button-component>

        <button-component
          group-btn
          vertical
          variant="secondary"
          size="sm"
          btn-text="Middle"
        ></button-component>

        <button-component
          group-btn
          end
          vertical
          variant="secondary"
          size="sm"
          btn-text="Bottom"
        ></button-component>
      </button-group>
    </main>
  \`,
})
export class AppComponent {}
`.trim();
