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

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-discrete-slider-example',
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
export class DiscreteSliderExampleComponent {
  stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
}
`;

export const angularVerticalExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-discrete-slider-vertical-example',
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
export class DiscreteSliderVerticalExampleComponent {
  stringValuesJson = JSON.stringify(['XS', 'S', 'M', 'L', 'XL']);
}
`;
