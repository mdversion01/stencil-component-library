export const reactExample = `import React from 'react';

export default function SliderManagerExample() {
  return (
    <slider-manager-component
      type="multi"
      label="Price Range"
      min="0"
      max="500"
      lower-value="125"
      upper-value="375"
      unit="$"
      slider-thumb-label
      tick-labels
      tick-values='[0,100,200,300,400,500]'
      variant="success"
      orientation="horizontal"
      range-fill-mode="inside"
    ></slider-manager-component>
  );
}
`;

export const reactVerticalExample = `import React from 'react';

export default function SliderManagerVerticalExample() {
  return (
    <slider-manager-component
      type="multi"
      label="Price Range"
      min="0"
      max="500"
      lower-value="125"
      upper-value="375"
      unit="$"
      slider-thumb-label
      tick-labels
      tick-values='[0,100,200,300,400,500]'
      variant="success"
      orientation="vertical"
      range-fill-mode="inside"
    ></slider-manager-component>
  );
}
`;

export const vueExample = `<template>
  <slider-manager-component
    type="multi"
    label="Price Range"
    min="0"
    max="500"
    lower-value="125"
    upper-value="375"
    unit="$"
    slider-thumb-label
    tick-labels
    :tick-values="tickValuesJson"
    variant="success"
    orientation="horizontal"
    range-fill-mode="inside"
  ></slider-manager-component>
</template>

<script setup>
const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>
`;

export const vueVerticalExample = `<template>
  <slider-manager-component
    type="multi"
    label="Price Range"
    min="0"
    max="500"
    lower-value="125"
    upper-value="375"
    unit="$"
    slider-thumb-label
    tick-labels
    :tick-values="tickValuesJson"
    variant="success"
    orientation="vertical"
    range-fill-mode="inside"
  ></slider-manager-component>
</template>

<script setup>
const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>
`;

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-slider-manager-horizontal',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <slider-manager-component
      type="multi"
      label="Price Range"
      min="0"
      max="500"
      lower-value="125"
      upper-value="375"
      unit="$"
      slider-thumb-label
      tick-labels
      [attr.tick-values]="tickValuesJson"
      variant="success"
      orientation="horizontal"
      range-fill-mode="inside"
    ></slider-manager-component>
  \`,
})
export class SliderManagerHorizontalComponent {
  tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
}

`;

export const angularVerticalExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-slider-manager-vertical',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <slider-manager-component
      type="multi"
      label="Price Range"
      min="0"
      max="500"
      lower-value="125"
      upper-value="375"
      unit="$"
      slider-thumb-label
      tick-labels
      [attr.tick-values]="tickValuesJson"
      variant="success"
      orientation="vertical"
      range-fill-mode="inside"
    ></slider-manager-component>
  \`,
})
export class SliderManagerVerticalComponent {
  tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
}

`;

export const svelteExample = `<script>
  const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>

<slider-manager-component
  type="multi"
  label="Price Range"
  min="0"
  max="500"
  lower-value="125"
  upper-value="375"
  unit="$"
  slider-thumb-label
  tick-labels
  tick-values={tickValuesJson}
  variant="success"
  orientation="horizontal"
  range-fill-mode="inside"
></slider-manager-component>
`;

export const svelteVerticalExample = `<script>
  const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>

<slider-manager-component
  type="multi"
  label="Price Range"
  min="0"
  max="500"
  lower-value="125"
  upper-value="375"
  unit="$"
  slider-thumb-label
  tick-labels
  tick-values={tickValuesJson}
  variant="success"
  orientation="vertical"
  range-fill-mode="inside"
></slider-manager-component>
`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';

  const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>

{#if browser}
  <slider-manager-component
    type="multi"
    label="Price Range"
    min="0"
    max="500"
    lower-value="125"
    upper-value="375"
    unit="$"
    slider-thumb-label
    tick-labels
    tick-values={tickValuesJson}
    variant="success"
    orientation="horizontal"
    range-fill-mode="inside"
  ></slider-manager-component>
{/if}
`;

export const svelteKitVerticalExample = `<script>
  import { browser } from '$app/environment';

  const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>

{#if browser}
  <slider-manager-component
    type="multi"
    label="Price Range"
    min="0"
    max="500"
    lower-value="125"
    upper-value="375"
    unit="$"
    slider-thumb-label
    tick-labels
    tick-values={tickValuesJson}
    variant="success"
    orientation="vertical"
    range-fill-mode="inside"
  ></slider-manager-component>
{/if}
`;
