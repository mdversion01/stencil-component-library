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

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-slider-manager-example',
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
export class SliderManagerExampleComponent {
  tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
}
`;

export const angularVerticalExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-slider-manager-vertical-example',
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
export class SliderManagerVerticalExampleComponent {
  tickValuesJson = JSON.stringify([0, 100, 200, 300, 400, 500]);
}
`;
