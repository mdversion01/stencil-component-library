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

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-multi-range-slider-example',
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
export class MultiRangeSliderExampleComponent {}
`;

export const angularVerticalExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-multi-range-slider-vertical-example',
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
export class MultiRangeSliderVerticalExampleComponent {}
`;
