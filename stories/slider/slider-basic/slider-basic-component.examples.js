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

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-slider-basic-example',
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
export class SliderBasicExampleComponent {}
`;

export const angularVerticalExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-slider-basic-vertical-example',
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
export class SliderBasicVerticalExampleComponent {}
`;
