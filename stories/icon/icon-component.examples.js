// File: src/stories/icon-component/icon-component.examples.js

export const reactExample = `
export default function IconComponent() {
  return (
    <main style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <icon-component
        icon="fa-solid fa-user"
        icon-size={20}
      ></icon-component>

      <icon-component
        icon="fa-solid fa-circle-info"
        color="#2563eb"
        icon-size={18}
        icon-aria-hidden={false}
        icon-aria-label="Information"
      ></icon-component>

      <icon-component
        icon="fa-solid fa-bell"
        token-icon
        icon-margin="left"
        color="#dc2626"
      ></icon-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
    <icon-component
      icon="fa-solid fa-user"
      :icon-size="20"
    ></icon-component>

    <icon-component
      icon="fa-solid fa-circle-info"
      color="#2563eb"
      :icon-size="18"
      :icon-aria-hidden="false"
      icon-aria-label="Information"
    ></icon-component>

    <icon-component
      icon="fa-solid fa-bell"
      token-icon
      icon-margin="left"
      color="#dc2626"
    ></icon-component>
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
    <main style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
      <icon-component
        icon="fa-solid fa-user"
        icon-size="20"
      ></icon-component>

      <icon-component
        icon="fa-solid fa-circle-info"
        color="#2563eb"
        icon-size="18"
        [iconAriaHidden]="false"
        icon-aria-label="Information"
      ></icon-component>

      <icon-component
        icon="fa-solid fa-bell"
        token-icon
        icon-margin="left"
        color="#dc2626"
      ></icon-component>
    </main>
  \`,
})
export class AppComponent {}
`.trim();
