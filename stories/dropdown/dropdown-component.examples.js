// File: src/stories/dropdown-component/dropdown-component.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function DropdownComponent() {
  const basicRef = useRef(null);
  const submenuRef = useRef(null);

  useEffect(() => {
    const baseItems = [
      { name: 'Action', value: 'action' },
      { name: 'Another action', value: 'another' },
      { name: 'Something else here', value: 'else' },
    ];

    const submenuItems = [
      {
        name: 'File',
        submenu: [
          { name: 'New', value: 'new' },
          { name: 'Open…', value: 'open' },
          { isDivider: true },
          { name: 'Recent', value: 'recent' },
        ],
      },
      {
        name: 'View',
        submenu: [
          { name: 'Zoom In', value: 'zin' },
          { name: 'Zoom Out', value: 'zout' },
          { name: 'Reset Zoom', value: 'zreset' },
        ],
      },
    ];

    if (basicRef.current) {
      basicRef.current.options = [...baseItems];
    }

    if (submenuRef.current) {
      submenuRef.current.options = [
        ...baseItems,
        { isDivider: true },
        ...submenuItems,
      ];
    }
  }, []);

  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <dropdown-component
        ref={basicRef}
        button-text="Dropdown"
        variant="primary"
      ></dropdown-component>

      <dropdown-component
        ref={submenuRef}
        button-text="More actions"
        variant="secondary"
      ></dropdown-component>
    </main>
  );
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <dropdown-component
      ref="basicDropdown"
      button-text="Dropdown"
      variant="primary"
    ></dropdown-component>

    <dropdown-component
      ref="submenuDropdown"
      button-text="More actions"
      variant="secondary"
    ></dropdown-component>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const basicDropdown = ref(null);
const submenuDropdown = ref(null);

onMounted(() => {
  const baseItems = [
    { name: 'Action', value: 'action' },
    { name: 'Another action', value: 'another' },
    { name: 'Something else here', value: 'else' },
  ];

  const submenuItems = [
    {
      name: 'File',
      submenu: [
        { name: 'New', value: 'new' },
        { name: 'Open…', value: 'open' },
        { isDivider: true },
        { name: 'Recent', value: 'recent' },
      ],
    },
    {
      name: 'View',
      submenu: [
        { name: 'Zoom In', value: 'zin' },
        { name: 'Zoom Out', value: 'zout' },
        { name: 'Reset Zoom', value: 'zreset' },
      ],
    },
  ];

  if (basicDropdown.value) {
    basicDropdown.value.options = [...baseItems];
  }

  if (submenuDropdown.value) {
    submenuDropdown.value.options = [
      ...baseItems,
      { isDivider: true },
      ...submenuItems,
    ];
  }
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <dropdown-component
        #basicDropdown
        button-text="Dropdown"
        variant="primary"
      ></dropdown-component>

      <dropdown-component
        #submenuDropdown
        button-text="More actions"
        variant="secondary"
      ></dropdown-component>
    </main>
  \`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('basicDropdown', { static: true }) basicDropdown!: ElementRef;
  @ViewChild('submenuDropdown', { static: true }) submenuDropdown!: ElementRef;

  ngAfterViewInit() {
    const baseItems = [
      { name: 'Action', value: 'action' },
      { name: 'Another action', value: 'another' },
      { name: 'Something else here', value: 'else' },
    ];

    const submenuItems = [
      {
        name: 'File',
        submenu: [
          { name: 'New', value: 'new' },
          { name: 'Open…', value: 'open' },
          { isDivider: true },
          { name: 'Recent', value: 'recent' },
        ],
      },
      {
        name: 'View',
        submenu: [
          { name: 'Zoom In', value: 'zin' },
          { name: 'Zoom Out', value: 'zout' },
          { name: 'Reset Zoom', value: 'zreset' },
        ],
      },
    ];

    this.basicDropdown.nativeElement.options = [...baseItems];
    this.submenuDropdown.nativeElement.options = [
      ...baseItems,
      { isDivider: true },
      ...submenuItems,
    ];
  }
}
`.trim();
