// File: src/stories/divider-component/divider-component.examples.js

export const reactExample = `
export default function DividerComponent() {
  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <div>
        <p>Content above</p>
        <divider-component></divider-component>
        <p>Content below</p>
      </div>

      <div>
        <p>Content above</p>
        <divider-component orientation="center" aria-label="Section divider">
          Section Title
        </divider-component>
        <p>Content below</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '48px' }}>
        <span>Left</span>
        <divider-component direction="vertical"></divider-component>
        <span>Right</span>
      </div>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <div>
      <p>Content above</p>
      <divider-component></divider-component>
      <p>Content below</p>
    </div>

    <div>
      <p>Content above</p>
      <divider-component orientation="center" aria-label="Section divider">
        Section Title
      </divider-component>
      <p>Content below</p>
    </div>

    <div style="display:flex; align-items:center; gap:12px; height:48px;">
      <span>Left</span>
      <divider-component direction="vertical"></divider-component>
      <span>Right</span>
    </div>
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
      <div>
        <p>Content above</p>
        <divider-component></divider-component>
        <p>Content below</p>
      </div>

      <div>
        <p>Content above</p>
        <divider-component orientation="center" aria-label="Section divider">
          Section Title
        </divider-component>
        <p>Content below</p>
      </div>

      <div style="display:flex; align-items:center; gap:12px; height:48px;">
        <span>Left</span>
        <divider-component direction="vertical"></divider-component>
        <span>Right</span>
      </div>
    </main>
  \`,
})
export class AppComponent {}
`.trim();
