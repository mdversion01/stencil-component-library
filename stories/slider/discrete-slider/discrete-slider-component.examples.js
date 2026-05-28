export const reactExample = `import React from 'react';

export default function DiscreteSliderExample() {
  return (
    <discrete-slider-component
      label="T-Shirt Size"
      selected-index="2"
      string-values='["XS","S","M","L","XL"]'
      tick-labels
      variant="secondary"
      orientation="horizontal"
    ></discrete-slider-component>
  );
}
`;

export const reactVerticalExample = `import React from 'react';

export default function DiscreteSliderVerticalExample() {
  return (
    <discrete-slider-component
      label="T-Shirt Size"
      selected-index="2"
      string-values='["XS","S","M","L","XL"]'
      tick-labels
      slider-thumb-label
      variant="secondary"
      orientation="vertical"
    ></discrete-slider-component>
  );
}
`;

export const vueExample = `<template>
  <discrete-slider-component
    label="T-Shirt Size"
    selected-index="2"
    :string-values="stringValuesJson"
    tick-labels
    variant="secondary"
    orientation="horizontal"
  ></discrete-slider-component>
</template>

<script setup>
const stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
</script>
`;

export const vueVerticalExample = `<template>
  <discrete-slider-component
    label="T-Shirt Size"
    selected-index="2"
    :string-values="stringValuesJson"
    tick-labels
    slider-thumb-label
    variant="secondary"
    orientation="vertical"
  ></discrete-slider-component>
</template>

<script setup>
const stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
</script>
`;

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-discrete-slider-horizontal',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <discrete-slider-component
      label="T-Shirt Size"
      selected-index="2"
      [attr.string-values]="stringValuesJson"
      tick-labels
      variant="secondary"
      orientation="horizontal"
    ></discrete-slider-component>
  \`,
})
export class DiscreteSliderHorizontalComponent {
  stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
}

`;

export const angularVerticalExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-discrete-slider-vertical',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <discrete-slider-component
      label="T-Shirt Size"
      selected-index="2"
      [attr.string-values]="stringValuesJson"
      tick-labels
      slider-thumb-label
      variant="secondary"
      orientation="vertical"
    ></discrete-slider-component>
  \`,
})
export class DiscreteSliderVerticalComponent {
  stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
}

`;

export const svelteExample = `<script>
  const stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
</script>

<section>
  <h2>Discrete Slider Example</h2>

  <discrete-slider-component
    label="T-Shirt Size"
    selected-index="2"
    string-values={stringValuesJson}
    tick-labels
    variant="secondary"
    orientation="horizontal"
  ></discrete-slider-component>
</section>
`;

export const svelteVerticalExample = `<script>
  const stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
</script>

<section>
  <h2>Discrete Slider Vertical Example</h2>

  <div style="height: 360px; display: flex; align-items: flex-start;">
    <discrete-slider-component
      label="T-Shirt Size"
      selected-index="2"
      string-values={stringValuesJson}
      tick-labels
      slider-thumb-label
      variant="secondary"
      orientation="vertical"
    ></discrete-slider-component>
  </div>
</section>
`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';

  const stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
</script>

<section>
  <h2>Discrete Slider Example</h2>

  {#if browser}
    <discrete-slider-component
      label="T-Shirt Size"
      selected-index="2"
      string-values={stringValuesJson}
      tick-labels
      variant="secondary"
      orientation="horizontal"
    ></discrete-slider-component>
  {/if}
</section>
`;

export const svelteKitVerticalExample = `<script>
  import { browser } from '$app/environment';

  const stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
</script>

<section>
  <h2>Discrete Slider Vertical Example</h2>

  {#if browser}
    <div style="height: 360px; display: flex; align-items: flex-start;">
      <discrete-slider-component
        label="T-Shirt Size"
        selected-index="2"
        string-values={stringValuesJson}
        tick-labels
        slider-thumb-label
        variant="secondary"
        orientation="vertical"
      ></discrete-slider-component>
    </div>
  {/if}
</section>
`;
