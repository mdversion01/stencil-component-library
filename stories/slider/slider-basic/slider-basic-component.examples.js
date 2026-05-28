// src/stories/slider-basic-component.examples.js
export const reactExample = `import React from 'react';

export default function SliderBasicExample() {
  return (
    <slider-basic-component
      label="Volume"
      min="0"
      max="100"
      value="30"
      variant="primary"
      orientation="horizontal"
    ></slider-basic-component>
  );
}
`;

export const reactVerticalExample = `import React from 'react';

export default function SliderBasicVerticalExample() {
  return (
    <slider-basic-component
      label="Volume"
      min="0"
      max="100"
      value="30"
      variant="primary"
      orientation="vertical"
    ></slider-basic-component>
  );
}
`;

export const vueExample = `<template>
  <slider-basic-component
    label="Volume"
    min="0"
    max="100"
    value="30"
    variant="primary"
    orientation="horizontal"
  ></slider-basic-component>
</template>
`;

export const vueVerticalExample = `<template>
  <slider-basic-component
    label="Volume"
    min="0"
    max="100"
    value="30"
    variant="primary"
    orientation="vertical"
  ></slider-basic-component>
</template>
`;

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-slider-basic-horizontal',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <slider-basic-component
      label="Volume"
      min="0"
      max="100"
      value="30"
      variant="primary"
      orientation="horizontal"
    ></slider-basic-component>
  \`,
})
export class SliderBasicHorizontalComponent {}
`;

export const angularVerticalExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-slider-basic-vertical',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <slider-basic-component
      label="Volume"
      min="0"
      max="100"
      value="30"
      variant="primary"
      orientation="vertical"
    ></slider-basic-component>
  \`,
})
export class SliderBasicVerticalComponent {}
`;

export const svelteExample = `<script>
  const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>

<section>
  <h2>Slider Manager Component Example</h2>

  <slider-basic-component
    label="Volume"
    min="0"
    max="100"
    value="30"
    variant="primary"
    orientation="horizontal"
  ></slider-basic-component>

  <div style="margin-top: 24px;">
    <slider-basic-component
      label="Price Range"
      min="0"
      max="500"
      value="125"
      unit="$"
      slider-thumb-label
      tick-labels
      tick-values={tickValuesJson}
      variant="success"
      orientation="horizontal"
    ></slider-basic-component>
  </div>
</section>
`;

export const svelteVerticalExample = `<script>
  const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>

<section>
  <h2>Slider Basic Vertical Example</h2>

  <div style="height: 360px; display: flex; align-items: flex-start;">
    <slider-basic-component
      label="Volume"
      min="0"
      max="100"
      value="30"
      variant="primary"
      orientation="vertical"
    ></slider-basic-component>
  </div>

  <div style="margin-top: 24px; height: 420px; display: flex; align-items: flex-start;">
    <slider-basic-component
      label="Price Range"
      min="0"
      max="500"
      value="125"
      unit="$"
      slider-thumb-label
      tick-labels
      tick-values={tickValuesJson}
      variant="success"
      orientation="vertical"
    ></slider-basic-component>
  </div>
</section>
`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';

  const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>

<section>
  <h2>Slider Manager Component Example</h2>

  {#if browser}
    <slider-basic-component
      label="Volume"
      min="0"
      max="100"
      value="30"
      variant="primary"
      orientation="horizontal"
    ></slider-basic-component>

    <div style="margin-top: 24px;">
      <slider-basic-component
        label="Price Range"
        min="0"
        max="500"
        value="125"
        unit="$"
        slider-thumb-label
        tick-labels
        tick-values={tickValuesJson}
        variant="success"
        orientation="horizontal"
      ></slider-basic-component>
    </div>
  {/if}
</section>
`;

export const svelteKitVerticalExample = `<script>
  import { browser } from '$app/environment';

  const tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
</script>

<section>
  <h2>Slider Basic Vertical Example</h2>

  {#if browser}
    <div style="height: 360px; display: flex; align-items: flex-start;">
      <slider-basic-component
        label="Volume"
        min="0"
        max="100"
        value="30"
        variant="primary"
        orientation="vertical"
      ></slider-basic-component>
    </div>

    <div style="margin-top: 24px; height: 420px; display: flex; align-items: flex-start;">
      <slider-basic-component
        label="Price Range"
        min="0"
        max="500"
        value="125"
        unit="$"
        slider-thumb-label
        tick-labels
        tick-values={tickValuesJson}
        variant="success"
        orientation="vertical"
      ></slider-basic-component>
    </div>
  {/if}
</section>
`;
