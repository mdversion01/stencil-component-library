// File: src/stories/badge-component/badge-component.examples.js

export const reactExample = `
export default function BadgeComponent() {
  return (
    <main style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <badge-component
        variant="primary"
        size="base"
        aria-label="Primary badge"
      >
        New
      </badge-component>

      <badge-component
        variant="success"
        shape="pill"
        aria-label="Success badge with icon"
        icon
      >
        Active
        <span slot="icon">
          <icon-component icon="fas fa-check-circle"></icon-component>
        </span>
      </badge-component>

      <badge-component
        token
        inset
        variant="danger"
        aria-label="Notification token badge"
      >
        <button-component variant="secondary" size="sm">
          Messages
        </button-component>
        <span slot="token">
          <i className="fa-solid fa-bell"></i>
        </span>
      </badge-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:flex; gap:12px; flex-wrap:wrap;">
    <badge-component
      variant="primary"
      size="base"
      aria-label="Primary badge"
    >
      New
    </badge-component>

    <badge-component
      variant="success"
      shape="pill"
      aria-label="Success badge with icon"
      icon
    >
      Active
      <span slot="icon">
        <icon-component icon="fas fa-check-circle"></icon-component>
      </span>
    </badge-component>

    <badge-component
      token
      inset
      variant="danger"
      aria-label="Notification token badge"
    >
      <button-component variant="secondary" size="sm">
        Messages
      </button-component>
      <span slot="token">
        <i class="fa-solid fa-bell"></i>
      </span>
    </badge-component>
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
      <badge-component
        variant="primary"
        size="base"
        aria-label="Primary badge"
      >
        New
      </badge-component>

      <badge-component
        variant="success"
        shape="pill"
        aria-label="Success badge with icon"
        icon
      >
        Active
        <span slot="icon">
          <icon-component icon="fas fa-check-circle"></icon-component>
        </span>
      </badge-component>

      <badge-component
        token
        inset
        variant="danger"
        aria-label="Notification token badge"
      >
        <button-component variant="secondary" size="sm">
          Messages
        </button-component>
        <span slot="token">
          <i class="fa-solid fa-bell"></i>
        </span>
      </badge-component>
    </main>
  \`,
})
export class AppComponent {}
`.trim();
