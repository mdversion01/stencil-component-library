export const reactExample = `import React from 'react';

export default function MultiRangeSliderExample() {
  return (
    <multi-range-slider-component
      label="Price range"
      lower-value="20"
      upper-value="80"
      min="0"
      max="100"
      unit="$"
      variant="primary"
      orientation="horizontal"
    ></multi-range-slider-component>
  );
}
`;

export const reactVerticalExample = `import React from 'react';

export default function MultiRangeSliderVerticalExample() {
  return (
    <multi-range-slider-component
      label="Price range"
      lower-value="20"
      upper-value="80"
      min="0"
      max="100"
      unit="$"
      variant="primary"
      orientation="vertical"
    ></multi-range-slider-component>
  );
}
`;

export const vueExample = `<template>
  <multi-range-slider-component
    label="Price range"
    lower-value="20"
    upper-value="80"
    min="0"
    max="100"
    unit="$"
    variant="primary"
    orientation="horizontal"
  ></multi-range-slider-component>
</template>
`;

export const vueVerticalExample = `<template>
  <multi-range-slider-component
    label="Price range"
    lower-value="20"
    upper-value="80"
    min="0"
    max="100"
    unit="$"
    variant="primary"
    orientation="vertical"
  ></multi-range-slider-component>
</template>
`;

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-multi-range-slider-horizontal',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <multi-range-slider-component
      label="Price range"
      lower-value="20"
      upper-value="80"
      min="0"
      max="100"
      unit="$"
      variant="primary"
      orientation="horizontal"
    ></multi-range-slider-component>
  \`,
})
export class MultiRangeSliderHorizontalComponent {}

`;

export const angularVerticalExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-multi-range-slider-vertical',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <multi-range-slider-component
      label="Price range"
      lower-value="20"
      upper-value="80"
      min="0"
      max="100"
      unit="$"
      variant="primary"
      orientation="vertical"
    ></multi-range-slider-component>
  \`,
})
export class MultiRangeSliderVerticalComponent {}

`;

export const svelteExample = `<section>
  <h2>Multi Range Slider Example</h2>

  <multi-range-slider-component
    label="Price range"
    lower-value="20"
    upper-value="80"
    min="0"
    max="100"
    unit="$"
    variant="primary"
    orientation="horizontal"
  ></multi-range-slider-component>
</section>
`;

export const svelteVerticalExample = `<section>
  <h2>Multi Range Slider Vertical Example</h2>

  <div style="height: 360px; display: flex; align-items: flex-start;">
    <multi-range-slider-component
      label="Price range"
      lower-value="20"
      upper-value="80"
      min="0"
      max="100"
      unit="$"
      variant="primary"
      orientation="vertical"
    ></multi-range-slider-component>
  </div>
</section>
`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';
</script>

<section>
  <h2>Multi Range Slider Example</h2>

  {#if browser}
    <multi-range-slider-component
      label="Price range"
      lower-value="20"
      upper-value="80"
      min="0"
      max="100"
      unit="$"
      variant="primary"
      orientation="horizontal"
    ></multi-range-slider-component>
  {/if}
</section>
`;

export const svelteKitVerticalExample = `<script>
  import { browser } from '$app/environment';
</script>

<section>
  <h2>Multi Range Slider Vertical Example</h2>

  {#if browser}
    <div style="height: 360px; display: flex; align-items: flex-start;">
      <multi-range-slider-component
        label="Price range"
        lower-value="20"
        upper-value="80"
        min="0"
        max="100"
        unit="$"
        variant="primary"
        orientation="vertical"
      ></multi-range-slider-component>
    </div>
  {/if}
</section>
`;
